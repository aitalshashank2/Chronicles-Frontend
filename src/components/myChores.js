import React from "react"
import axios from "axios"

import Navbar from "./miscellaneous/navbar"

import {CardGroup, Grid, Header, Loader, Segment, Card, Image} from "semantic-ui-react"

import "../style/utility.css"
import "../style/myChores.css"

const backend = "http://localhost:54330/api"

class MyChoresProjectList extends React.Component{
    constructor(props) {
        super(props)
        this.state = {userProjectsLoaded: false, userProjects: null}
    }

    componentDidMount() {
        axios.get('/users/projects/').then(res=>{
            this.setState({userProjectsLoaded: true, userProjects: res.data})
        }).catch(err => {
            this.setState({userProjectsLoaded: false, userProjects: null})
        })
    }

    render(){
        if(this.state.userProjectsLoaded){

            if(this.state.userProjects.length === 0){
                return (
                    <div className={"flex_centered height_full_percent"}>
                        <p className={"description_grey"}>You are not a member of any projects <span role={"img"} aria-label={"sad_emoji"}>😥</span></p>
                    </div>
                )
            }

            return (
                <CardGroup centered>
                    {this.state.userProjects.map((value, index) => {
                        return (
                            <Card color={"purple"} href={"/projects/"+value['slug']+"/"} key={index}>
                                <Image src={backend+value['image']} wrapped ui={false} />
                                <Card.Content>
                                    <Card.Header>{value['name']}</Card.Header>
                                </Card.Content>
                            </Card>
                        )
                    })}
                </CardGroup>
            )
        }else{
            return (
                <div className={"flex_centered"}>
                    <Loader active size={"medium"} />
                </div>
            )
        }
    }
}

class MyChoresBugList extends React.Component{
    constructor(props) {
        super(props)
        this.state = {bugsLoad: false, bugs: null}
    }

    componentDidMount() {
        axios.get('/users/bugReports/').then(res=>{
            this.setState({bugsLoad: true, bugs: res.data})
        }).catch(err => {
            this.setState({bugsLoad: false, bugs: null})
        })
    }

    render(){
        if(this.state.bugsLoad){

            if(this.state.bugs.length === 0){
                return (
                    <div className={"flex_centered height_full_percent"}>
                        <p className={"description_grey"}>No bug reports to fix!<span role={"img"} aria-label={"spoc_hand"}> </span>🖖</p>
                    </div>
                )
            }

            return (
                <Card.Group centered>
                    {this.state.bugs.map((value, index) => {
                        return (
                            <Card color={value['status'] ? "green" : "red"} href={"/projects/"+value['project']['slug']+'/'} key={index}>
                                <Card.Content>
                                    <Card.Header>{value['heading']}</Card.Header>
                                    <Card.Meta>{value['reporter']['username']}</Card.Meta>
                                    <Card.Description>
                                        Project: {value['project']['name']}<br />

                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        )
                    })}
                </Card.Group>
            )
        }else{
            return (
                <div className={"flex_centered"}>
                    <Loader active size={"medium"} />
                </div>
            )
        }
    }
}

class MyChores extends React.Component{
    constructor(props) {
        super(props);
        this.state = {isMobile: false}
    }

    componentDidMount() {
        this.updatePredicate()
        window.addEventListener("resize", this.updatePredicate)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updatePredicate)
    }

    updatePredicate = () => {
        this.setState({isMobile: window.innerWidth < 800})
    }

    render(){
        return (
            <div>
                <Navbar /><br />
                <Grid className={"width_full_percent"} divided padded stackable>
                    <Grid.Column width={7}>
                        <Header textAlign={"center"}>Bug Reports assigned to me</Header>
                        <Segment floated style={{height: this.state.isMobile ? "auto" : "83vh"}} className={"scroll scrollBar"}>
                            <MyChoresBugList />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={9}>
                        <Header textAlign={"center"}>Projects</Header>
                        <Segment floated style={{height: this.state.isMobile ? "auto" : "83vh"}} className={"scroll scrollBar"}>
                            <MyChoresProjectList />
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default MyChores
