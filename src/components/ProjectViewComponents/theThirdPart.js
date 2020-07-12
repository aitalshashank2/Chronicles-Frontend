import React from "react";
import {Header, Loader} from "semantic-ui-react"
import NewBugReportForm from "./newBugReportForm"
import BugReportDetail from "./bugReportDetail"
import logo from "../static/projectLogo.gif"

import "../../style/utility.css"
import "../../style/ProjectViewComponents/theThirdPart.css"

class TheThirdPart extends React.Component{
    handleRedirect = (childState) => {
        this.props.onChange(childState)
    }

    render() {
        if(this.props.stateIndex === 0){
            return (
                <div className={"flex_centered height_full_percent width_full_percent"}>
                    <div>
                        <img src={logo} type={"image/gif"} className={"logo_3"} alt={"Chronicles"} />
                        <Header size={"huge"} content={"Chronicles"} color={"purple"} textAlign={'center'} className={"header_3_top"}/>
                        <Header size={"tiny"} content={"A place where Bugs perish"} textAlign={'center'} className={"header_3_bottom"}/>
                    </div>
                </div>
            )
        }else if(this.props.stateIndex === -1){
            return (
                <NewBugReportForm project={this.props.project} onChange={this.handleRedirect} />
            )
        }else if(this.props.stateIndex > 0){
            return (
                <BugReportDetail isMobile={this.props.isMobile} project={this.props.project} bugReport={this.props.stateIndex} onChange={this.handleRedirect} canEdit={this.props.canEdit} />
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

export default TheThirdPart
