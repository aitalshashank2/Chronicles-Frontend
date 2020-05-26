import React from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import {Dropdown, Header, Menu} from "semantic-ui-react"

class Navbar extends React.Component{
    constructor(props) {
        super(props)
        this.state = {loggedin: true}
    }

    logout = () => {
        axios.get('http://localhost:8000/users/logout/', {withCredentials: true}).then(
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
        if(this.state.profile){
            return <Redirect to={"/profile/"} />
        }

        if(this.state.add){
            return <Redirect to={"/projects/"} />
        }

        if(this.state.loggedin){
            return (
                <Menu borderless>
                    <Menu.Item>
                        <a href={"/"}><Header size={"huge"}>Chronicles</Header></a>
                    </Menu.Item>
                    <Menu.Item position={"right"}>
                        <Dropdown text={this.props.user} direction={"right"} floating item simple>
                            <Dropdown.Menu>
                                <Dropdown.Item icon={"user"} text={"Profile"} value={"profile"} onClick={this.handleDropDown}/>
                                <Dropdown.Item icon={"plus"} text={"New Project"} value={"add"} onClick={this.handleDropDown}/>
                                <Dropdown.Item icon={"sign-out"} onClick={this.logout} text={"Logout"} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                </Menu>
            )
        }else{
            return <Redirect to={"/login/"} />
        }
    }
}
export default Navbar