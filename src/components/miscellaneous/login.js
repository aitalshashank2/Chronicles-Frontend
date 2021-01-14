import React from 'react'
import cookie from 'react-cookies'
import randomstring from 'randomstring'
import {Redirect} from 'react-router-dom'
import axios from "axios"
import projectLogo from "../static/projectLogo.gif"

import {Button, Menu, Header} from "semantic-ui-react"

import "../../style/utility.css"
import "../../style/miscellaneous/login.css"

class Login extends React.Component{

    constructor(props) {
        super(props)
        this.statetoken = randomstring.generate()
        this.state = {loggedin:false}
    }

    componentDidMount() {

        axios.get('/users/curr/').then(
            (response) => {
                    this.setState({loggedin:true})
            }
        ).catch(error => {
            this.setState({loggedin: false})
        })
    }

    render(){
        let url = "https://internet.channeli.in/oauth/authorise/?client_id=nUeXTqAt8eJEwfmgZ9vIRSTyexUldebZO8Ht43H0&redirect_url=http://localhost:54330/logger/&state="+this.statetoken

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
                    <div className={"flex_centered crux_inner"}>
                        <div>
                            <img src={projectLogo} type={"image/gif"} alt={"Chronicles"} />
                            <Header size={"huge"} content={"Chronicles"} color={"purple"} textAlign={'center'} className={"header_top"}/>
                            <Header size={"tiny"} content={"A place where Bugs perish"} textAlign={'center'} className={"header_bottom"}/>
                        </div>
                    </div><br /><br />
                </div>
            )
        }else{
            return <Redirect to={"/"} />
        }
    }
}

export default Login