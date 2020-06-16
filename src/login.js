import React from 'react'
import cookie from 'react-cookies'
import randomstring from 'randomstring'
import {Redirect} from 'react-router-dom'
import axios from "axios"
import projectLogo from "./projectLogo.gif"

import {Button, Menu, Header} from "semantic-ui-react"

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
                    <div style={{display:"flex", alignItems: "center", justifyContent: "center", height: '90vh', width: '100%'}}>
                        <div>
                            <img src={projectLogo} type={"image/gif"} alt={"Chronicles"} />
                            <Header size={"huge"} content={"Chronicles"} color={"purple"} textAlign={'center'} style={{marginBottom: '0'}}/>
                            <Header size={"tiny"} content={"A place where Bugs perish"} textAlign={'center'} style={{marginTop: '0'}}/>
                        </div>
                    </div>
                </div>
            )
        }else{
            return <Redirect to={"/"}></Redirect>
        }
    }
}

export default Login