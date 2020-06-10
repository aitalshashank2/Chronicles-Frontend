import React from "react"
import axios from "axios"

import {Segment, Form, Header, Loader} from "semantic-ui-react";

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
                <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                    <Loader active size={"medium"} />
                </div>
            )
        }else{
            commentList = (
                <div style={{height: '51vh', overflowY: "scroll"}} className={"scrollBar"}>
                    {this.state.comments.map((value, index) => {
                        return (
                            <Segment vertical>
                                <Header size={"small"} style={{margin: 0, color:"#400080"}}>{value['commenter']['username']}</Header>
                                <p>{value['body']}</p>
                            </Segment>
                        )
                    })}
                    {this.state.newCommentList.map((value, index) => {
                        return (
                            <Segment vertical>
                                <Header size={"small"} style={{margin: 0, color:"#400080"}}>{value['commenter']['username']}</Header>
                                <p>{value['body']}</p>
                            </Segment>
                        )
                    })}
                    <div style={{float:"left", clear: "both"}} ref={(el) => this.commentsEnd = el} />
                </div>
            )
        }

        return (
            <Segment style={{height: '60vh'}}>
                {commentList}<hr />
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group>
                        <Form.Input width={14} value={this.state.commentData} onChange={this.handleChange} />
                        <Form.Button content={"Send"} fluid width={2} />
                    </Form.Group>
                </Form>
            </Segment>
        )
    }
}

export default CommentHandler
