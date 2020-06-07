import React from "react"
import axios from "axios"
import {
    Grid,
    Loader,
    Image,
    Header,
    Segment,
    Card,
    Icon
} from "semantic-ui-react"

import Navbar from "./navbar"

import ProjectInfo from "./ProjectViewComponents/projectInfo"
import BugList from "./ProjectViewComponents/bugList"
import TheThirdPart from "./ProjectViewComponents/theThirdPart"

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

class ProjectView extends React.Component{

    constructor(props) {
        super(props);
        this.state = {bugReport: 0, projectLoaded: false, magImage:""}
    }

    componentDidMount() {
        axios.get('/projects/'+this.props.match.params.slug+'/').then((response) => {
            this.setState({projectLoaded: true, project: response.data, projectDetailsVisible:false})
        }).catch((error) => {
            this.setState({projectLoaded: false})
        })
    }

    handleChange = (childState) => {
        this.setState(childState)
    }

    render(){

        if(this.state.projectLoaded){
            if(this.state.magImage !== ""){
                return (
                    <div style={{width: '100%', height: '100vh', backgroundColor: '#000000'}}>
                        <Icon name={"close"} size={"large"} inverted style={{float: "right", position: "relative", margin:'0.5em', zIndex:2}} link onClick={() => {this.setState({magImage: ""})}}/>
                        <div style={{width: '100%', height: '100vh', display:'flex', justifyContent:'center', alignItems:'center', position: "absolute"}}>
                            <Image src={this.state.magImage} style={{maxHeight: '100vh', maxWidth: '100%'}} />
                        </div>
                    </div>
                )
            }

            return (
                <div>
                    <Navbar />
                    <Grid divided style={{minHeight: 'calc(100vh - 66px)', maxHeight: 'calc(100vh - 66px)', position:"absolute"}} padded>
                        <Grid.Column width={4} style={{maxHeight: 'inherit'}}>
                            <Header className={"hoverPointer"} size={"huge"} textAlign={"center"} onClick={() => {this.setState({projectDetailsVisible: true})}}>{this.state.project['name']}</Header>
                            <Card color={"purple"} fluid onClick={() => {this.setState({bugReport: -1})}} style={{padding: '1em', alignItems:'center'}}>
                                <Header as='h4' style={{display: 'flex', alignItems: 'center'}}>
                                    <Icon name='add' />
                                    <Header.Content>New Report</Header.Content>
                                </Header>
                            </Card>
                            <Segment style={{maxHeight: '87%' ,overflowY: 'scroll', backgroundColor: "#5c00b309"}} className={"scrollBar"}>
                                <Header as={"h3"} textAlign={"center"}>Bugs<hr /></Header>
                                <BugList slug={this.props.match.params.slug} onChange={this.handleChange} />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={12} style={{overflowY: 'scroll', maxHeight: 'inherit'}} className={"scrollBar"}>
                            <TheThirdPart stateIndex={this.state.bugReport} project={this.state.project['id']} onChange={this.handleChange} />
                        </Grid.Column>
                    </Grid>
                    <ProjectInfo project={this.state.project} onChange={this.handleChange} isVisible={this.state.projectDetailsVisible} />
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