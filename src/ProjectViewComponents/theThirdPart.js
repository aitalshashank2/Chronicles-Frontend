import React from "react";
import {Header, Loader} from "semantic-ui-react";
import NewBugReportForm from "./newBugReportForm";
import BugReportDetail from "./bugReportDetail";

class TheThirdPart extends React.Component{
    handleRedirect = (childState) => {
        this.props.onChange(childState)
    }

    render() {
        if(this.props.stateIndex === 0){
            return (
                <div style={{display:"flex", alignItems: "center", justifyContent: "center", height: '100%', width: '100%'}}>
                    <div>
                        <Header size={"huge"} content={"Chronicles"} color={"purple"} textAlign={'center'} style={{marginBottom: '0'}}/>
                        <Header size={"tiny"} content={"A place where Bugs perish"} textAlign={'center'} style={{marginTop: '0'}}/>
                    </div>
                </div>
            )
        }else if(this.props.stateIndex === -1){
            return (
                <NewBugReportForm project={this.props.project} onChange={this.handleRedirect} />
            )
        }else if(this.props.stateIndex > 0){
            return (
                <BugReportDetail bugReport={this.props.stateIndex} onChange={this.handleRedirect} />
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

export default TheThirdPart
