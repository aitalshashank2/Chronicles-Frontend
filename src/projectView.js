import React from "react"
import axios from "axios"
import {
    Grid,
    Loader,
    Header,
    Segment,
    Card,
    Icon,
    Container,
    Modal
} from "semantic-ui-react"

import Navbar from "./navbar"

import ProjectInfo from "./ProjectViewComponents/projectInfo"
import BugList from "./ProjectViewComponents/bugList"
import TheThirdPart from "./ProjectViewComponents/theThirdPart"

import NewBugReportForm from "./ProjectViewComponents/newBugReportForm"

export const tagLegend = [
    "Functionality",
    "Usability",
    "Interface",
    "Compatibility",
    "Performance",
    "Security",
    "Management",
    "Code",
    "UI",
    "UX",
    "New Feature",
    "Fat gaya",
    "Design",
    "Front end",
    "Back end",
    "Database",
    "External Resource",
    "Coverage",
    "Bug",
    "Improvement",
    "Broken",
    "Cookie",
    "Typo"
]

class MobileProjectView extends React.Component{
    constructor(props) {
        super(props)
        this.state = this.props.parentState
    }

    handleChange = (childState) => {
        this.setState(childState)
    }

    isAdminOrTeamMember = () => {
        if(this.state.user['isAdmin'] || this.state.project['team'].includes(this.state.user['id'])){
            return true
        }else{
            return false
        }
    }

    render(){

        if(this.state.bugReport === 0){
            return (
                <div>
                    <Navbar />
                    <Container>
                        <Modal trigger={<Header style={{color: "#290066", marginTop: '5px'}} className={"hoverPointer"} size={"huge"} textAlign={"center"} onClick={() => {this.setState({projectDetailsVisible: true})}}>{this.state.project['name']}</Header>}>
                            <Modal.Content style={{backgroundColor: "#000000"}} scrolling>
                                <Modal.Description>
                                    <ProjectInfo isMobile={this.state.isMobile} project={this.state.project} onChange={this.handleChange} isVisible={this.state.projectDetailsVisible} canEdit={this.isAdminOrTeamMember()} />
                                </Modal.Description>
                            </Modal.Content>
                        </Modal>
                        <Card color={"purple"} fluid onClick={() => {this.setState({bugReport: -1})}} style={{padding: '1em', alignItems:'center'}}>
                            <Header as='h4' style={{display: 'flex', alignItems: 'center'}}>
                                <Icon name='add' />
                                <Header.Content>New Report</Header.Content>
                            </Header>
                        </Card>
                        <Segment style={{backgroundColor: "#6600ff0f"}}>
                            <Header as={"h3"} textAlign={"center"}>Bugs<hr /></Header>
                            <BugList project={this.state.project} onChange={this.handleChange} />
                        </Segment>
                    </Container>

                </div>
            )
        }else{
            return (
                <div>
                    <Navbar />
                    <Header style={{color: "#290066", marginTop: '5px'}} className={"hoverPointer"} size={"huge"} textAlign={"center"} onClick={()=>{this.setState({bugReport: 0})}}>{this.state.project['name']}</Header>
                    <TheThirdPart isMobile={this.state.isMobile} stateIndex={this.state.bugReport} project={this.state.project['id']} onChange={this.handleChange} canEdit={this.isAdminOrTeamMember()} />
                </div>
            )
        }
    }
}

class ProjectView extends React.Component{

    constructor(props) {
        super(props);
        this.state = {bugReport: 0, projectLoaded: false, user:null, getUser:false, isMobile: false}
    }

    componentDidMount() {
        this.updatePredicate()
        window.addEventListener("resize", this.updatePredicate)

        axios.get('/projects/'+this.props.match.params.slug+'/').then((response) => {
            this.setState({projectLoaded: true, project: response.data, projectDetailsVisible:false})
        }).catch((error) => {
            this.setState({projectLoaded: false})
        })

        axios.get('/users/curr/').then(res => {
            this.setState({user: res.data, getUser: true})
        }).catch(err => {
            this.setState({user: "Anon"})
        })
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updatePredicate)
    }

    updatePredicate = () => {
        this.setState({isMobile: window.innerWidth < 800})
    }

    isAdminOrTeamMember = () => {
        if(this.state.user['isAdmin'] || this.state.project['team'].includes(this.state.user['id'])){
            return true
        }else{
            return false
        }
    }

    handleChange = (childState) => {
        this.setState(childState)
    }

    render(){

        if(this.state.projectLoaded && this.state.getUser){

            if(this.state.isMobile){
                return (
                    <MobileProjectView parentState={this.state} />
                )
            }

            return (
                <div>
                    <Navbar />
                    <Grid divided style={{minHeight: 'calc(100vh - 66px)', maxHeight: 'calc(100vh - 66px)', position:"absolute"}} padded>
                        <Grid.Column width={4} style={{maxHeight: 'inherit'}}>
                            <Header style={{color: "#290066"}} className={"hoverPointer"} size={"huge"} textAlign={"center"} onClick={() => {this.setState({projectDetailsVisible: true})}}>{this.state.project['name']}</Header>
                            <Card color={"purple"} fluid onClick={() => {this.setState({bugReport: -1})}} style={{padding: '1em', alignItems:'center'}}>
                                <Header as='h4' style={{display: 'flex', alignItems: 'center'}}>
                                    <Icon name='add' />
                                    <Header.Content>New Report</Header.Content>
                                </Header>
                            </Card>
                            <Segment style={{maxHeight: '87%' ,overflowY: 'scroll', backgroundColor: "#6600ff0f"}} className={"scrollBar"}>
                                <Header as={"h3"} textAlign={"center"}>Bugs<hr /></Header>
                                <BugList project={this.state.project} onChange={this.handleChange} />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={12} style={{overflowY: 'scroll', maxHeight: 'inherit'}} className={"scrollBar"}>
                            <TheThirdPart stateIndex={this.state.bugReport} project={this.state.project['id']} onChange={this.handleChange} canEdit={this.isAdminOrTeamMember()} />
                        </Grid.Column>
                    </Grid>
                    <ProjectInfo project={this.state.project} onChange={this.handleChange} isVisible={this.state.projectDetailsVisible} canEdit={this.isAdminOrTeamMember()} />
                </div>
            )
        }else{
            return (
                <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                    <Loader active size="medium" />
                </div>
            )
        }
    }
}

export default ProjectView