import React from "react"
import axios from "axios"
import {Header, Item, Label, Loader, Segment, Checkbox, Button} from "semantic-ui-react"
import {tagLegend} from "../projectView"
import CommentHandler from "./commentHandler"
import {Dropdown, Modal} from "semantic-ui-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import CKeditor from "@ckeditor/ckeditor5-react"

import "../../style/utility.css"
import "../../style/ProjectViewComponents/bugReportDetail.css"

class BugReportDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {bugReportReceived: false, usersReceived: false, changedPersonInCharge: null, errorInSub: null}
    }

    dockBugReport = () => {
        axios.get('/bugReports/'+this.props.bugReport+'/').then((response) => {
            this.setState({
                bugReportReceived: true,
                bugReport: response.data,
                bugReportID: response.data['id'],
                bugReportProject: response.data['project'],
                bugReportReporter: response.data['reporter'],
                bugReportHeading: response.data['heading'],
                bugReportDescription: response.data['description'],
                bugReportPIC: response.data['person_in_charge'],
                changedPersonInCharge: (response.data['person_in_charge'] === null ? null : response.data['person_in_charge']['id']),
                bugReportStatus: response.data['status'],
                changedStatus: response.data['status'],
                bugReportTagHash: response.data['tagsHash'],
                bugReportImage: response.data['image'],
            })
        }).catch((error) => {
            this.setState({bugReportReceived: false})
        })

        axios.get('/projects/'+this.props.project+'/team/').then(res=>{
            this.setState({allMembers: res.data, usersReceived: true})
        }).catch(err=>{
            this.setState({allMembers: null})
        })
    }

    tagDeHash = function(h) {
        let x = []
        let i = 0
        while(i<32){
            if((h&(1<<i)) !== 0){
                x.push(i)
            }
            i++
        }
        return x
    }

    componentDidMount() {
        this.dockBugReport()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.bugReport !== this.props.bugReport){
            this.dockBugReport()
        }
    }

    handlePersonInCharge = (event, data) => {
        this.setState({changedPersonInCharge: data.value})
    }

    handleStatus = () => {
        this.setState((prevState) => ({changedStatus: !prevState.changedStatus}))
    }

    handlePatch = () => {
        const data = new FormData()
        data.append('person_in_charge', this.state.changedPersonInCharge)
        data.append('status', this.state.changedStatus)

        if(this.state.changedPersonInCharge === null){
            this.setState({errorInSub: "There must be a person in charge before changing the status of bug report."})
        }else{

            axios.patch('/bugReports/'+this.state.bugReportID+'/', data).then(res=>{
                this.dockBugReport()
            }).catch(err=>{
                console.log("Failure")
            })

        }
    }

    handleDelete = () => {
        axios.delete('/bugReports/'+this.state.bugReportID+'/').then(res => {
            this.props.onChange({bugReport: 0})
        }).catch(err => {
            console.log(err)
        })
    }

    render(){
        if(this.state.bugReportReceived && this.state.usersReceived){
            const userOptions = this.state.allMembers.map((val, index) => ({
                key: val['id'],
                text: val['username'],
                value: val['id'],
            }))
            let PIC = null, statusDesc = null, patchButton = null, deleteButton = null, errorMessage = null
            if(this.props.canEdit){
                PIC = (
                    <Dropdown value={this.state.changedPersonInCharge} className={"PIC"} placeholder={"Person in Charge"} search selection options={userOptions} onChange={this.handlePersonInCharge} />
                )
                statusDesc = (
                    <div style={{marginLeft: this.props.isMobile ? "0" : "5em", marginRight: this.props.isMobile ? "0" : "5em"}} className={"statusDesc"}>
                        <Header floated={"left"}>Status: </Header>
                        <Checkbox slider value={this.state.changedStatus} checked={this.state.changedStatus} onChange={this.handleStatus} />
                    </div>
                )
                deleteButton = (
                    <Button color={"red"} onClick={this.handleDelete}>Delete</Button>
                )
                if(this.state.bugReportPIC===null){
                    if((this.state.changedPersonInCharge !== null) || (this.state.bugReportStatus !== this.state.changedStatus)){
                        patchButton = (
                            <Button primary content={"Submit"} onClick={this.handlePatch} />
                        )
                    }
                }else{
                    if((this.state.changedPersonInCharge !== this.state.bugReportPIC['id']) || (this.state.bugReportStatus !== this.state.changedStatus)){
                        patchButton = (
                            <Button primary content={"Submit"} onClick={this.handlePatch} />
                        )
                    }
                }
            }else{
                PIC = (
                    <Header as={'h4'} style={{color: (this.state.bugReportPIC === null) ? 'red' : 'green'}}>
                        Person in charge: {(this.state.bugReportPIC === null) ? "Not assigned" : this.state.bugReportPIC['username']}
                    </Header>
                )
            }

            errorMessage = (
                <p className={"error_red"}>{this.state.errorInSub}</p>
            )

            let itemDesc
            if(this.props.isMobile){
                itemDesc = (
                    <Item.Description>
                        {PIC}
                        {statusDesc}{this.props.canEdit ? <br/> : null}
                        {patchButton}
                        {deleteButton}{this.props.canEdit ? <br/> : null}
                        {errorMessage}{this.props.canEdit ? <br/> : null}
                    </Item.Description>
                )
            }else{
                itemDesc = (
                    <Item.Description>
                        {PIC}{statusDesc}{patchButton}{deleteButton}{errorMessage}
                    </Item.Description>
                )
            }

            return (
                <div>
                    <Segment raised style={{backgroundColor: (this.state.bugReportStatus ? '#e6ffe6':'#ffe6e6'), height: this.props.isMobile ? "auto" : '25vh', overflowY: "scroll"}} className={"scrollBar"} >
                        <Item.Group>
                            <Item>
                                <Item.Content verticalAlign={'middle'}>
                                    <Modal trigger={<Item.Header className={"hoverPointer bug_description"}>{this.state.bugReportHeading}</Item.Header>}>
                                        <Modal.Header>{this.state.bugReportHeading}</Modal.Header>
                                        <Modal.Content scrolling>
                                            <Modal.Description>
                                                <CKeditor
                                                    editor={ClassicEditor}
                                                    data={this.state.bugReportDescription}
                                                    disabled={true}
                                                    config={
                                                        {
                                                            toolbar: [],
                                                            isReadOnly: true,
                                                        }
                                                    }
                                                />
                                            </Modal.Description>
                                        </Modal.Content>
                                    </Modal>
                                    <Item.Meta>Reporter: {this.state.bugReportReporter['username']}</Item.Meta>
                                    {itemDesc}<br />
                                    <Item.Extra>
                                        <div>
                                            {this.tagDeHash(this.state.bugReportTagHash).map((value1, index1) => {
                                                return (
                                                    <Label tag className={"tag"} key={index1}>{tagLegend[value1]}</Label>
                                                )
                                            })}
                                        </div>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Segment>
                    {this.props.isMobile ? (
                        <div>
                            <br />
                            <Modal trigger={<Button fluid color={"violet"}>Comments</Button>}>
                                <CommentHandler report={this.state.bugReportID} isMobile={this.props.isMobile} />
                            </Modal>
                        </div>
                    ) : <CommentHandler report={this.state.bugReportID} isMobile={this.props.isMobile} />}
                </div>
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

export default BugReportDetail
