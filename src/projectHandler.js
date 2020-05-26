import React from "react"

import {Container, Form, Loader, Header, TextArea, Dropdown, Button} from 'semantic-ui-react'

import Navbar from "./navbar"
import axios from "axios"
import {Redirect} from "react-router-dom"

class ProjectForm extends React.Component{
    constructor(props) {
        super(props)
        this.state = {userListReceived: false, userList: [], creationSuccess: false, name:'', description:'', team: [], image: null}
    }

    componentDidMount() {
        axios.get('http://localhost:8000/users/', {withCredentials:true}).then(
            (response) => {
                this.setState({userList: response.data,userListReceived:true})
            }
        )
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value})

    }

    handleDropDown = (event, data) => {
        this.state.team.push(data.value)
        console.log(data.value)
        console.log(this.state.team)
    }

    handleImage = (event) => {
        this.setState({image: event.target.files[0]})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const url = 'http://localhost:8000/projects/'
        const formdata = new FormData()
        formdata.append('name', this.state.name)
        console.log(this.state.name)
        formdata.append('description', this.state.description)
        this.state.team[this.state.team.length-1].forEach((value) => {
            formdata.append('team', value)
        })
        formdata.append('image', this.state.image)

        const config = {
            headers:{
                'content-type': 'multipart/form-data'
            },
            withCredentials: true,
        }
        axios.defaults.xsrfCookieName = 'csrftoken'
        axios.defaults.xsrfHeaderName = 'X-CSRFToken'

        axios.post(url, formdata, config).then((response) => {
            this.setState({creationSuccess: true})
        }).catch((error) => {
            console.log("Some error occurred")
        })
    }

    render(){
        if(this.state.creationSuccess){
            return (
                <Redirect to={"/"} />
            )
        }

        if(this.state.userListReceived){
            const userOptions = this.state.userList.map((val, index) => ({
                key: val['id'],
                text: val['username'],
                value: val['id'],
            }))

            return (
                <Form onSubmit={this.handleSubmit}>
                    <Header size={"huge"}>New Project</Header>
                    <Form.Field>
                        <label>Name</label>
                        <input placeholder={"Name of project"} type={"text"} name={"name"} onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <TextArea placeholder={"Description of the project"} type={"text"} name={"description"} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Team Members</label>
                        <Dropdown placeholder={"Team Members"} fluid multiple search selection options={userOptions} onChange={this.handleDropDown}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Project Logo</label>
                        <input type={"file"} name={"image"} onChange={this.handleImage} accept={"image/png, image/jpeg, image/jpg"}/>
                    </Form.Field>
                    <Button type={"submit"}>Create</Button>
                </Form>
            )
        }else{
            return (
                <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                    <Loader active size="massive" />
                </div>
            )
        }
    }
}

class ProjectHandler extends React.Component{
    constructor(props) {
        super(props)
        this.state = {user: 'anon', responseRec: false, loggedin:false}
    }

    componentDidMount() {
        axios.get('http://localhost:8000/users/curr/', {withCredentials:true}).then(
            (response) => {
                this.setState({user: response.data.user, responseRec: true, loggedin:true})
            }
        ).catch(error => {
            this.setState({responseRec: true})
        })
    }

    render(){
        if(this.state.responseRec){
            if(!this.state.loggedin){
                return <Redirect to="/login/" />
            }else{
                return (
                    <div>
                        <Navbar user={this.state.user} />
                        <Container>
                            <ProjectForm />
                        </Container>
                    </div>
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
export default ProjectHandler