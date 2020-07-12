import React from "react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import CKeditor from "@ckeditor/ckeditor5-react"
import UploadAdapter from "./miscellaneous/uploadAdapter"
import randomstring from 'randomstring'

import {Container, Form, Loader, Header, Dropdown, Button, Message} from 'semantic-ui-react'

import Navbar from "./miscellaneous/navbar"
import axios from "axios"
import {Redirect} from "react-router-dom"
import slug from 'slug'

import "../style/utility.css"

class ProjectForm extends React.Component{
    constructor(props) {
        super(props)
        this.state = {userListReceived: false, userList: [], creationSuccess: false, name:'', description:'', team: [], image: null, slug:'', errorStatus: false, errorMsg:'', ckeditorURLS: [], randIdentifier: randomstring.generate()}
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
        if(event.target.name === 'name'){
            this.setState({slug: slug(event.target.value)})
        }
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
        if(this.state.image !== null){
            formdata.append('image', this.state.image)
        }
        formdata.append('slug', this.state.slug)

        const config = {
            headers:{
                'content-type': 'multipart/form-data'
            }
        }

        axios.post(url, formdata, config).then((response) => {
            this.setState({creationSuccess: true})
        }).catch((error) => {
            this.setState({errorStatus: true, errorMsg:error.response.data})
        })

        const deleteData = new FormData()
        deleteData.append('randIdentifier', this.state.randIdentifier)
        deleteData.append('urls', this.state.ckeditorURLS)
        axios.post('/images/deleteRem/', deleteData, config).then((response) => {
            console.log("Success")
        }).catch(err => {
            console.log('failure')
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

            let errorMessage
            if(this.state.errorStatus){
                let innerErrorMessage = (
                    <div>
                        {Object.keys(this.state.errorMsg).map((key) => {
                            return (
                                <p><b>{key}: </b>{this.state.errorMsg[key]}</p>
                            )
                        })}
                    </div>
                )
                errorMessage = (
                    <Message negative>{innerErrorMessage}</Message>
                )
            }else{
                errorMessage = (<div className={"none"} />)
            }

            return (
                <Form onSubmit={this.handleSubmit}>
                    <br />
                    <Header size={"huge"}>New Project</Header>
                    {errorMessage}
                    <Form.Field required>
                        <label>Name</label>
                        <input placeholder={"Name of project"} type={"text"} name={"name"} onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Slug</label>
                        <input placeholder={"slug"} type={"text"} name={"slug"} onChange={this.handleChange} defaultValue={slug(this.state.name)} />
                    </Form.Field>
                    <Form.Field required>
                        <label>Description</label>
                        <CKeditor
                            editor={ClassicEditor}
                            onInit={editor=>{
                                const randIdentifier = this.state.randIdentifier
                                editor.plugins.get('FileRepository').createUploadAdapter = function(loader){
                                    return new UploadAdapter(loader, randIdentifier)
                                }
                            }}
                            onChange={(event, editor) => {
                                const ckeditorURLS = Array.from( new DOMParser().parseFromString( editor.getData(), 'text/html' )
                                        .querySelectorAll( 'img' ) )
                                        .map( img => img.getAttribute( 'src' ) )
                                this.setState({
                                    description: editor.getData(),
                                    ckeditorURLS: ckeditorURLS,
                                })

                            }}
                        />
                    </Form.Field>
                    <Form.Field required>
                        <label>Team Members</label>
                        <Dropdown placeholder={"Team Members"} fluid multiple search selection options={userOptions} onChange={this.handleDropDown}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Project Logo</label>
                        <input type={"file"} name={"image"} onChange={this.handleImage} accept={"image/png, image/jpeg, image/jpg"}/>
                    </Form.Field>
                    <Button type={"submit"}>Create</Button><br /><br />
                </Form>
            )
        }else{
            return (
                <div className={"flex_centered"}>
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
                <div className={"flex_centered"}>
                    <Loader active size="massive" />
                </div>
            )
        }
    }
}
export default ProjectHandler