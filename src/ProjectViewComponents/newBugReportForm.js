import React from "react";
import axios from "axios";
import CKeditor from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import randomstring from 'randomstring'

import {Button, Dropdown, Form, Header, Segment, Message} from "semantic-ui-react";

import {tagLegend} from "../projectView";
import UploadAdapter from "../uploadAdapter";

class NewBugReportForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {randIdentifier: randomstring.generate(), tagHash: 0, errName: null, errDesc: null, errTags: null, heading: "", description: ""}
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleDropdown = (event, data) => {
        let x=0
        let tagHash=0
        for(x=0; x<data.value.length; x++){
            tagHash|=(1<<data.value[x])
        }
        this.setState({tagHash: tagHash})
    }

    handleSubmit = (event) => {
        event.preventDefault()

        if(this.state.heading === ""){
            this.setState({errName: "Please enter a heading for your report."})
        }else{
            this.setState({errName: null})
        }
        if(this.state.tagHash === 0){
            this.setState({errTags: "Please select at least one tag."})
        }else{
            this.setState({errTags: null})
        }
        if(this.state.description === ""){
            this.setState({errDesc: "Please enter a description for your report."})
        }else{
            this.setState({errDesc: null})
        }
        if(this.state.heading !== "" && this.state.tagHash !== 0 && this.state.description !== ""){
            const url = "/bugReports/"
            const formData = new FormData()
            formData.append('project', this.props.project)
            formData.append('heading', this.state.heading)
            formData.append('description', this.state.description)
            formData.append('tagsHash', this.state.tagHash)

            const config = {
                headers:{
                    'content-type': 'multipart/form-data'
                }
            }
            axios.post(url, formData, config).then((response) => {
                this.props.onChange({bugReport: response.data["id"]})
            }).catch(error => {
                console.log(error.response.data)
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
    }

    render() {
        let tags = tagLegend.map((val, index) => ({
            key: index,
            text: val,
            value: index,
        }))

        let errorHandler

        if(this.state.errName !== null || this.state.errTags !== null || this.state.errDesc !== null){
            errorHandler = (
                <Message negative>
                    <h3>Umm... You need to take care of a few things!</h3>
                    <p>{this.state.errName}</p>
                    <p>{this.state.errTags}</p>
                    <p>{this.state.errDesc}</p>
                </Message>
            )
        }

        return (
            <Segment color={"purple"}>
                <Form onSubmit={this.handleSubmit}>
                    <Header size={"huge"} style={{color: '#800080'}}>New Bug Report</Header>
                    {errorHandler}
                    <Form.Field required>
                        <label>Title</label>
                        <input placeholder={"Title for Bug Report"} type={"text"} name={"heading"} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field required>
                        <label>Tags</label>
                        <Dropdown placeholder={"Tags"} fluid multiple search selection options={tags} onChange={this.handleDropdown} />
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
                    <Button type={"submit"}>Report</Button>
                </Form>
            </Segment>
        )
    }
}

export default NewBugReportForm
