import React from "react";
import axios from "axios";
import {Card, CardGroup, Header, Label, Loader} from "semantic-ui-react";

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
                    <div style={{textAlign: "center"}}>
                        <p style={{color: "grey"}}>No Reports as of now!</p>
                    </div>
                )
            }

            return (
                <CardGroup>
                    {this.state.bugReports.map((value, index) => {
                        return (
                            <Card color={value['status'] ? 'green' : 'red'} fluid style={{padding: '0.5em', marginBottom: '0.25em', backgroundColor: "inherit"}} onClick={() => {this.props.onChange({bugReport: value['id']})}} key={index}>
                                <Header size={"small"}>{value['heading']}</Header>
                                <div>
                                    {this.tagDeHash(value['tagsHash']).map((value1, index1) => {
                                        return (
                                            <Label tag style={{backgroundColor: '#3d0099', marginBottom: '5px', color: "white"}} key={index1}>{tagLegend[value1]}</Label>
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
                <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                    <Loader active size={"medium"} />
                </div>
            )
        }
    }
}

export default BugList
