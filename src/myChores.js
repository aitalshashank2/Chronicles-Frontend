import React from "react"
import axios from "axios"

import Navbar from "./navbar"

import {CardGroup, Grid, Header, Loader, Segment, Card, Image} from "semantic-ui-react"

const backend = "http://localhost:8000"

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
            return (
                <CardGroup itemsPerRow={3}>
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
                <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
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
            return (
                <Card.Group>
                    {this.state.bugs.map((value, index) => {
                        return (
                            <Card color={value['status'] ? "green" : "red"} fluid href={"/projects/"+value['project']['slug']+'/'} key={index}>
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
                <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                    <Loader active size={"medium"} />
                </div>
            )
        }
    }
}

class MyChores extends React.Component{
    render(){
        return (
            <div>
                <Navbar /><br />
                <Grid style={{width: "100%"}} divided padded>
                    <Grid.Column width={8}>
                        <Header textAlign={"center"}>Projects</Header>
                        <Segment floated style={{height: '83vh', overflowY: "scroll"}} className={"scrollBar"}>
                            <MyChoresProjectList />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Header textAlign={"center"}>Bug Reports assigned to me</Header>
                        <Segment floated style={{height: '83vh', overflowY: "scroll"}} className={"scrollBar"}>
                            <MyChoresBugList />
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default MyChores
