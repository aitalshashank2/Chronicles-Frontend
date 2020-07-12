import React from "react";
import axios from "axios";
import {Card, CardGroup, Header, Label, Loader} from "semantic-ui-react";

import "../../style/utility.css"
import "../../style/ProjectViewComponents/bugList.css"

import {tagLegend} from "../projectView"

class BugList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {loadBugReports: false}
    }

    componentDidMount() {
        axios.get('/projects/'+this.props.project['id']+'/bugReports/').then((response) => {
            this.setState({loadBugReports: true, bugReports: response.data})
        }).catch((error) => {
            this.setState({loadBugReports: false})
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

    render(){
        if(this.state.loadBugReports){

            if(this.state.bugReports.length === 0){
                return (
                    <div className={"no_bugs_container"}>
                        <p className={"no_bugs_description"}>No Reports as of now!</p>
                    </div>
                )
            }

            return (
                <CardGroup>
                    {this.state.bugReports.map((value, index) => {
                        return (
                            <Card color={value['status'] ? 'green' : 'red'} fluid className={"bug_list_card"} onClick={() => {this.props.onChange({bugReport: value['id']})}} key={index}>
                                <Header size={"small"}>{value['heading']}</Header>
                                <div>
                                    {this.tagDeHash(value['tagsHash']).map((value1, index1) => {
                                        return (
                                            <Label tag className={"bug_list_card_label"} key={index1}>{tagLegend[value1]}</Label>
                                        )
                                    })}
                                </div>
                            </Card>
                        )
                    })}<br />
                </CardGroup>
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

export default BugList
