import React from 'react';
import cookie from 'react-cookies';
import randomstring from 'randomstring';

import {Button, Menu, Header} from "semantic-ui-react";

class Login extends React.Component{

    constructor(props) {
        super(props);
        this.statetoken = randomstring.generate()
    }

    componentDidMount() {
        cookie.remove('statetoken', {path: "/logger"});
        cookie.save('statetoken', this.statetoken, {path: "/logger"});
    }

    render(){
        let url = "https://internet.channeli.in/oauth/authorise/?client_id=nUeXTqAt8eJEwfmgZ9vIRSTyexUldebZO8Ht43H0&redirect_url=http://localhost:3000/logger/&state="+this.statetoken;
        return (
            <Menu borderless inverted>
                <Menu.Item>
                    <a href="/"><Header size={"huge"} inverted>Chronicles</Header></a>
                </Menu.Item>
                <Menu.Item position="right">
                    <a href={url}>
                        <Button inverted primary>Login with omniport</Button>
                    </a>
                </Menu.Item>
            </Menu>
        );
    }
}

export default Login;