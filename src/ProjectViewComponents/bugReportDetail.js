import React from "react";
import axios from "axios";
import {Header, Item, Label, Loader, Segment, Checkbox, Button} from "semantic-ui-react";
import {tagLegend} from "../projectView";
import CommentHandler from "./commentHandler";
import {Dropdown} from "semantic-ui-react";

class BugReportDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {bugReportReceived: false, usersReceived: false, changedPersonInCharge: null}
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

        axios.patch('/bugReports/'+this.state.bugReportID+'/', data).then(res=>{
            this.dockBugReport()
        }).catch(err=>{
            console.log("Failure")
        })
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
            let PIC, statusDesc, patchButton, deleteButton
            if(this.props.canEdit){
                PIC = (
                    <Dropdown value={this.state.changedPersonInCharge} style={{margin: '0.5em'}} placeholder={"Person in Charge"} search selection options={userOptions} onChange={this.handlePersonInCharge} />
                )
                statusDesc = (
                    <div style={{display: "inline-flex", marginLeft: "5em", marginRight: "5em"}}>
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

            return (
                <div>
                    <Segment raised style={{backgroundColor: (this.state.bugReportStatus ? '#e6ffe6':'#ffe6e6'), height: '25vh', overflowY: "scroll"}} className={"scrollBar"} >
                        <Item.Group>
                            <Item>
                                <Item.Content verticalAlign={'middle'}>
                                    <Item.Header className={"hoverPointer"} style={{fontSize: '2em', lineHeight: '2.2em'}} onClick={() => this.props.onChange({bugReportDetail: this.state.bugReport})}>{this.state.bugReportHeading}</Item.Header>
                                    <Item.Meta>Reporter: {this.state.bugReportReporter['username']}</Item.Meta>
                                    <Item.Description>
                                        {PIC}{statusDesc}{patchButton}{deleteButton}
                                    </Item.Description><br />
                                    <Item.Extra>
                                        <div>
                                            {this.tagDeHash(this.state.bugReportTagHash).map((value1, index1) => {
                                                return (
                                                    <Label tag style={{backgroundColor: '#eaeffa', marginBottom:'1em'}} key={index1}>{tagLegend[value1]}</Label>
                                                )
                                            })}
                                        </div>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Segment>
                    <CommentHandler report={this.state.bugReportID} />
                </div>
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

export default BugReportDetail
