import React from 'react'
import cookie from 'react-cookies'
import randomstring from 'randomstring'
import {Redirect} from 'react-router-dom'
import axios from "axios"

import {Button, Menu, Header, Container} from "semantic-ui-react"

class Login extends React.Component{

    constructor(props) {
        super(props)
        this.statetoken = randomstring.generate()
        this.state = {loggedin:false}
    }

    componentDidMount() {

        axios.get('http://localhost:8000/users/curr/', {withCredentials:true}).then(
            (response) => {
                    this.setState({loggedin:true})
            }
        ).catch(error => {
            this.setState({loggedin: false})
        })
    }

    render(){
        let url = "https://internet.channeli.in/oauth/authorise/?client_id=nUeXTqAt8eJEwfmgZ9vIRSTyexUldebZO8Ht43H0&redirect_url=http://localhost:3000/logger/&state="+this.statetoken

        if(!this.state.loggedin){
            cookie.remove('statetoken', {path: "/logger"})
            cookie.save('statetoken', this.statetoken, {path: "/logger"})

            return (
                <div>
                    <Menu borderless>
                        <Menu.Item>
                            <a href="/"><Header size={"huge"}>Chronicles</Header></a>
                        </Menu.Item>
                        <Menu.Item position="right">
                            <a href={url}>
                                <Button primary>Login with omniport</Button>
                            </a>
                        </Menu.Item>
                    </Menu>
                    <Container>
                        <Header size={"large"}>Chronicles</Header>
                    </Container>
                </div>
            )
        }else{
            return <Redirect to={"/"}></Redirect>
        }
    }
}

export default Login