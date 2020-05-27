import React from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import {Dropdown, Header, Loader, Menu} from "semantic-ui-react"

class Navbar extends React.Component{
    constructor(props) {
        super(props)
        this.state = {user: 'anon', responseRec: false, loggedin:false}
    }

    componentDidMount() {
        axios.get('/users/curr/').then(
            (response) => {
                this.setState({user: response.data.user, responseRec: true, loggedin:true})
            }
        ).catch(error => {
            this.setState({responseRec: true})
        })
    }

    logout = () => {
        axios.get('/users/logout/').then(
            (response) => {
                this.setState({loggedin:false, add:false, profile:false})
            }
        )
    }

    handleDropDown = (event, data) => {
        if(data.value === "profile"){
            this.setState({profile: true})
        }else if(data.value === "add"){
            this.setState({add:true})
        }
    }

    render(){
        if(this.state.responseRec){
            if(!this.state.loggedin){
                return <Redirect to="/login/" />
            }else{
                if(this.state.profile){
                    return <Redirect to={"/profile/"} />
                }

                if(this.state.add){
                    return <Redirect to={"/projects/"} />
                }

                return (
                    <Menu borderless>
                        <Menu.Item>
                            <a href={"/"}><Header size={"huge"}>Chronicles</Header></a>
                        </Menu.Item>
                        <Menu.Item position={"right"}>
                            <Dropdown text={this.state.user} direction={"right"} floating item simple>
                                <Dropdown.Menu>
                                    <Dropdown.Item icon={"user"} text={"Profile"} value={"profile"} onClick={this.handleDropDown}/>
                                    <Dropdown.Item icon={"plus"} text={"New Project"} value={"add"} onClick={this.handleDropDown}/>
                                    <Dropdown.Item icon={"sign-out"} onClick={this.logout} text={"Logout"} />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </Menu>
                )

            }
        }else{
            return (
                <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                    <Loader active size="massive" />
                </div>
            )
        }
    }
}
export default Navbar