import React from "react"
import axios from "axios"
import {Redirect} from 'react-router-dom'

import Navbar from "./navbar"
import SingleLogo from "./singleLogo.png"

import {Loader, Container, Header ,List, Image, Checkbox} from "semantic-ui-react";

class AdminView extends React.Component{
    constructor(props) {
        super(props);
        this.state={loadUsers: false, loadCurrUser: false, isCurrUserAdmin: false, changedUserList: null}
    }

    componentDidMount() {
        axios.get('/users/curr/').then(res => {
            if(res.data['isAdmin']){
                this.setState({loadCurrUser: true, isCurrUserAdmin: true})
            }else{
                this.setState({loadCurrUser: true, isCurrUserAdmin: false})
            }
        })

        axios.get('/users/').then(res=>{
            this.setState({loadUsers: true, users: res.data, changedUserList: res.data})
        }).catch(err => {
            this.setState({loadUsers: false})
        })
    }

    handleAdmin = (x) => {
        let y = this.state.changedUserList
        y[x]['isAdmin'] = !y[x]['isAdmin']
        this.setState({changedUserList: y})

        axios.patch('/users/'+this.state.changedUserList[x]['id']+'/', {isAdmin: y[x]['isAdmin']}).then(res => {
            console.log("success")
        })
    }

    handleActive = (x) => {
        let y = this.state.changedUserList
        y[x]['is_active'] = !y[x]['is_active']
        this.setState({changedUserList: y})

        axios.patch('/users/'+this.state.changedUserList[x]['id']+'/', {is_active: y[x]['is_active']}).then(res => {
            console.log("success")
        })
    }

    render(){
        if(this.state.loadCurrUser && this.state.loadUsers){
            if(this.state.isCurrUserAdmin){
                return (
                    <div>
                        <Navbar /><br />
                        <Container>
                            <Header textAlign={"center"}>Users</Header><hr />
                            <List divided verticalAlign={"middle"}>
                                {this.state.changedUserList.map((value, index) => {
                                    return (
                                        <List.Item style={{padding: '1em'}}>
                                            <List.Content floated='right' >
                                                <Checkbox style={{marginRight: '3em'}} label={"Admin Status"} slider checked={value['isAdmin']} onChange={(x=index)=>{this.handleAdmin(index)}} />
                                                |<Checkbox style={{marginLeft: '3em'}} label={"Active Status"} slider checked={value['is_active']} onChange={(x=index)=>{this.handleActive(index)}} />
                                            </List.Content>
                                            <Image avatar src={SingleLogo} />
                                            <List.Content>
                                                <Header as={"h4"} style={{color:value['isAdmin'] ? "#400080" : "#000000"}}>{value['username']}</Header>
                                            </List.Content>
                                        </List.Item>
                                    )
                                })}
                            </List>
                        </Container>
                    </div>
                )
            }else{
                return (
                    <Redirect to={"/"} />
                )
            }
        }else{
            return (
                <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                    <Loader active size="medium" />
                </div>
            )
        }
    }
}

export default AdminView
