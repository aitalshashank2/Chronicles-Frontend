import React from "react"
import axios from "axios"
import {Redirect} from 'react-router-dom'

import Navbar from "./miscellaneous/navbar"
import SingleLogo from "./static/singleLogo.png"

import {Loader, Container, Header, List, Image, Checkbox, Card} from "semantic-ui-react"

import "../style/utility.css"
import "../style/adminView.css"

class AdminView extends React.Component{
    constructor(props) {
        super(props);
        this.state={isMobile: false, loadUsers: false, loadCurrUser: false, isCurrUserAdmin: false, changedUserList: null}
    }

    componentDidMount() {
        this.updatePredicate()
        window.addEventListener("resize", this.updatePredicate)

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

    componentWillUnmount() {
        window.removeEventListener("resize", this.updatePredicate)
    }

    updatePredicate = () => {
        this.setState({isMobile: window.innerWidth < 800})
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

                if(this.state.isMobile){
                    return (
                        <div>
                            <Navbar /><br />
                            <Container>
                                <Card.Group centered>
                                    {this.state.changedUserList.map((value, index) => {
                                        return (
                                            <Card>
                                                <Card.Content>
                                                    <Image floated={"right"} size={"mini"} src={SingleLogo} />
                                                    <Card.Header style={{color:value['isAdmin'] ? "#400080" : "#000000"}}>{value['username']}</Card.Header>
                                                    <Card.Description>
                                                        <Checkbox label={"Admin Status"} slider checked={value['isAdmin']} onChange={(x=index)=>{this.handleAdmin(index)}} /><br /><br />
                                                        <Checkbox label={"Active Status"} slider checked={value['is_active']} onChange={(x=index)=>{this.handleActive(index)}} />
                                                    </Card.Description>
                                                </Card.Content>
                                            </Card>
                                        )
                                    })}
                                </Card.Group>
                            </Container>
                        </div>
                    )
                }else{
                    return (
                        <div>
                            <Navbar /><br />
                            <Container>
                                <Header textAlign={"center"}>Users</Header><hr />
                                <List divided verticalAlign={"middle"}>
                                    {this.state.changedUserList.map((value, index) => {
                                        return (
                                            <List.Item className={'list_item'}>
                                                <List.Content floated='right' >
                                                    <Checkbox className={'checkbox_right'} label={"Admin Status"} slider checked={value['isAdmin']} onChange={(x=index)=>{this.handleAdmin(index)}} />
                                                    |<Checkbox className={'checkbox_left'} label={"Active Status"} slider checked={value['is_active']} onChange={(x=index)=>{this.handleActive(index)}} />
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
                }
            }else{
                return (
                    <Redirect to={"/"} />
                )
            }
        }else{
            return (
                <div className={'flex_centered'}>
                    <Loader active size="medium" />
                </div>
            )
        }
    }
}

export default AdminView
