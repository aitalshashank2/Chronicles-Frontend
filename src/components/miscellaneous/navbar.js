import React from 'react'
import axios from 'axios'
import {Dropdown, Header, Loader, Menu, Sticky, Icon} from "semantic-ui-react"

import "../../style/utility.css"
import "../../style/miscellaneous/navbar.css"

class Navbar extends React.Component{
    constructor(props) {
        super(props)
        this.state = {user: 'anon', responseRec: false, loggedin:false, admin:false, isMobile:false}
    }

    updatePredicate = () => {
        this.setState({isMobile: window.innerWidth < 600})
    }

    componentDidMount() {
        this.updatePredicate()
        window.addEventListener("resize", this.updatePredicate)

        axios.get('/users/curr/').then(
            (response) => {
                this.setState({user: response.data, responseRec: true, loggedin:true})
            }
        ).catch(error => {
            this.setState({responseRec: true})
        })
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updatePredicate)
    }

    logout = () => {
        axios.get('/users/logout/').then(
            (response) => {
                this.setState({loggedin:false, add:false, my_chores:false})
            }
        )
    }

    handleDropDown = (event, data) => {
        if(data.value === "my_chores"){
            this.setState({my_chores: true})
        }else if(data.value === "add"){
            this.setState({add:true})
        }else if(data.value === "adminView"){
            this.setState({admin: true})
        }
    }

    render(){
        if(this.state.responseRec){
            if(!this.state.loggedin){
                window.location = "/login/"
            }else{
                if(this.state.my_chores){
                    window.location="/my_chores/"
                }

                if(this.state.add){
                    window.location="/projects/"
                }

                if(this.state.admin){
                    window.location="/admin/"
                }

                let adminButton, adminLink

                if(this.state.user['isAdmin']){
                    adminButton = (
                        <Dropdown.Item icon={"spy"} text={"Admin"} value={"adminView"} onClick={this.handleDropDown} />
                    )
                    adminLink = (
                        <Menu.Item>
                            <a href={"/admin/"}>Admin</a>
                        </Menu.Item>
                    )
                }

                let opt

                if(this.state.isMobile){
                    opt = (
                        <Menu.Item position={"right"}>
                            <Dropdown text={this.state.user['username']} direction={"right"} floating item simple className={"_dropdown"}>
                                <Dropdown.Menu>
                                    {adminButton}
                                    <Dropdown.Item icon={"user"} text={"My Chores"} value={"my_chores"} onClick={this.handleDropDown}/>
                                    <Dropdown.Item icon={"plus"} text={"New Project"} value={"add"} onClick={this.handleDropDown}/>
                                    <Dropdown.Item icon={"sign-out"} onClick={this.logout} text={"Logout"} />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    )
                }else{
                    opt = (
                        <Menu.Menu position={"right"}>
                            {adminLink}
                            <Menu.Item>
                                <a href={"/projects/"}>New Project</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a href={"/my_chores/"}><b className={"_my_chores"}>{this.state.user['username']}</b></a>
                            </Menu.Item>
                            <Menu.Item>
                                <Icon name={"power"} onClick={this.logout} className={"hoverPointer"} />
                            </Menu.Item>
                        </Menu.Menu>
                    )
                }

                return (
                    <Sticky>
                        <Menu borderless inverted className={"_menu"}>
                            <Menu.Item>
                                <a href={"/"}><Header size={"medium"} inverted>Chronicles</Header></a>
                            </Menu.Item>
                            {opt}
                        </Menu>
                    </Sticky>
                )

            }
        }else{
            return (
                <div className={"flex_centered"}>
                    <Loader active size="massive" />
                </div>
            )
        }
    }
}
export default Navbar