import React from "react"

import {Container, Form, Loader, Header, TextArea, Dropdown, Button, Message} from 'semantic-ui-react'

import Navbar from "./navbar"
import axios from "axios"
import {Redirect} from "react-router-dom"
import slug from 'slug'

class ProjectForm extends React.Component{
    constructor(props) {
        super(props)
        this.state = {userListReceived: false, userList: [], creationSuccess: false, name:'', description:'', team: [], image: null, slug:'', errmsg:''}
    }

    componentDidMount() {
        axios.get('/users/').then(
            (response) => {
                this.setState({userList: response.data,userListReceived:true})
            }
        )
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value})
    }

    handleDropDown = (event, data) => {
        this.setState({team: data.value})
    }

    handleImage = (event) => {
        this.setState({image: event.target.files[0]})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const url = '/projects/'
        const formdata = new FormData()
        formdata.append('name', this.state.name)
        formdata.append('description', this.state.description)
        this.state.team.forEach((value) => {
            formdata.append('team', value)
        })
        formdata.append('image', this.state.image)
        formdata.append('slug', this.state.slug)

        const config = {
            headers:{
                'content-type': 'multipart/form-data'
            }
        }

        axios.post(url, formdata, config).then((response) => {
            this.setState({creationSuccess: true})
        }).catch((error) => {
            this.setState({errmsg:error.response.data['slug']})
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

            const Errmsg = () => (
                <Message negative>
                    <Message.Header>{this.state.errmsg}</Message.Header>
                </Message>
            )

            if(this.state.errmsg !== ''){
                return <Errmsg />
            }

            return (
                <Form onSubmit={this.handleSubmit}>
                    <Header size={"huge"}>New Project</Header>
                    <Form.Field>
                        <label>Name</label>
                        <input placeholder={"Name of project"} type={"text"} name={"name"} onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Slug</label>
                        <input placeholder={"slug"} type={"text"} name={"slug"} onChange={this.handleChange} defaultValue={slug(this.state.name)} />
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <TextArea placeholder={"Description of the project"} type={"text"} name={"description"} onChange={this.handleChange}/>
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
        axios.get('/users/curr/', {withCredentials:true}).then(
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