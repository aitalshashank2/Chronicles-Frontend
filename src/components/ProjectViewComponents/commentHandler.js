import React from "react"
import axios from "axios"

import {Segment, Form, Header, Loader} from "semantic-ui-react";

import "../../style/utility.css"
import "../../style/ProjectViewComponents/commentHandler.css"

class CommentHandler extends React.Component{
    constructor(props) {
        super(props)
        this.state={commentData:"", comments: null, newCommentList: [], bugReport: this.props.report}
    }

    ws = new WebSocket('ws://localhost:8000/ws/bugReport/'+this.props.report+'/')

    scrollToBottom = () => {
        this.commentsEnd.scrollIntoView({ behavior: "smooth" });
    }

    dockComment = () => {
        axios.get('/bugReports/'+this.props.report+'/comments/').then(res => {
            this.setState({comments: res.data})
        }).catch(err => {
            this.setState({comments: null})
        })

        this.ws.onopen = () => {
            console.log("Connected")
        }

        this.ws.onmessage = evt => {
            const dataFromServer = JSON.parse(evt.data)
            const newComments = this.state.newCommentList
            newComments.push(dataFromServer)
            this.setState({newCommentList: newComments})
        }
    }

    componentDidMount() {
        this.dockComment()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.report !== this.props.report){
            this.setState({newCommentList: []})
            this.dockComment()
        }

        this.scrollToBottom()
    }

    handleChange = (event) => {
        this.setState({commentData: event.target.value})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const url = '/comments/'
        const formData = new FormData()
        formData.append('report', this.props.report)
        formData.append('body', this.state.commentData)

        const config = {
            headers:{
                'content-type': 'multipart/form-data'
            }
        }
        this.setState({commentData: ''})

        axios.post(url, formData, config).then(response => {
            this.ws.send(JSON.stringify({comment_id: response.data['id']}))
        }).catch(err => {
            console.log("Failure")
        })
    }

    render() {
        let commentList

        if(this.state.comments === null){
            commentList = (
                <div className={"flex_centered"}>
                    <Loader active size={"medium"} />
                </div>
            )
        }else{

            if(this.state.comments.length === 0 && this.state.newCommentList.length === 0){
                commentList = (
                    <div className={"flex_centered"} style={{height: this.props.isMobile ? '70vh' : '55vh'}}>
                        <p className={"no_comment_placeholder"}>Be the first one to comment</p>
                        <div style={{float:"left", clear: "both"}} ref={(el) => this.commentsEnd = el} />
                    </div>
                )
            }else{
                commentList = (
                    <div style={{height: this.props.isMobile ? '70vh' : '55vh', overflowY: "scroll"}} className={"scrollBar"}>
                        {this.state.comments.map((value, index) => {
                            return (
                                <Segment vertical>
                                    <Header size={"small"} className={"comment_header"}>{value['commenter']['username']}</Header>
                                    <p>{value['body']}</p>
                                </Segment>
                            )
                        })}
                        {this.state.newCommentList.map((value, index) => {
                            return (
                                <Segment vertical>
                                    <Header size={"small"} className={"comment_header"}>{value['commenter']['username']}</Header>
                                    <p>{value['body']}</p>
                                </Segment>
                            )
                        })}
                        <div style={{float:"left", clear: "both"}} ref={(el) => this.commentsEnd = el} />
                    </div>
                )
            }
        }

        if(this.props.isMobile){
            return (
                <Segment className={"crux_mobile"}>
                    {commentList}<hr />
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Input width={16} value={this.state.commentData} onChange={this.handleChange} />
                        </Form.Group>
                    </Form>
                </Segment>
            )
        }

        return (
            <Segment className={"crux_desktop"}>
                {commentList}<hr />
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group>
                        <Form.Input width={14} value={this.state.commentData} onChange={this.handleChange} />
                        <Form.Button color={"purple"} content={"Send"} fluid width={2} />
                    </Form.Group>
                </Form>
            </Segment>
        )
    }
}

export default CommentHandler
