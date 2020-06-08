import React from "react";
import axios from "axios";
import {Header, Item, Label, Loader, Segment} from "semantic-ui-react";
import {tagLegend} from "../projectView";
import CommentHandler from "./commentHandler";

class BugReportDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {bugReportReceived: false}
    }

    dockBugReport = () => {
        axios.get('/bugReports/'+this.props.bugReport+'/').then((response) => {
            this.setState({
                bugReportReceived: true,
                bugReportID: response.data['id'],
                bugReportProject: response.data['project'],
                bugReportReporter: response.data['reporter'],
                bugReportHeading: response.data['heading'],
                bugReportDescription: response.data['description'],
                bugReportPIC: response.data['person_in_charge'],
                bugReportStatus: response.data['status'],
                bugReportTagHash: response.data['tagsHash'],
                bugReportImage: response.data['image'],
            })
        }).catch((error) => {
            this.setState({bugReportReceived: false})
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

    render(){
        if(this.state.bugReportReceived){

            return (
                <div>
                    <Segment raised className={"hoverPointer"} style={{backgroundColor: (this.state.bugReportStatus ? '#e6ffe6':'#ffe6e6')}} onClick={() => this.props.onChange({bugDescription: this.state.bugReportDescription})}>
                        <Item.Group>
                            <Item>
                                <Item.Content verticalAlign={'middle'}>
                                    <Item.Header style={{fontSize: '2em', lineHeight: '2.2em'}}>{this.state.bugReportHeading}</Item.Header>
                                    <Item.Meta>Reporter: {this.state.bugReportReporter['username']}</Item.Meta>
                                    <Item.Description>
                                        <Header as={'h4'} style={{color: (this.state.bugReportPIC === null) ? 'red' : 'green'}}>
                                            Person in charge: {(this.state.bugReportPIC === null) ? "Not assigned" : this.state.bugReportPIC['username']}
                                        </Header>
                                    </Item.Description>
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
