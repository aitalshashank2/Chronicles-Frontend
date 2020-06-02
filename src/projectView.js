import React from "react"
import axios from "axios"
import {
    Grid,
    Loader,
    Image,
    Header,
    List,
    Segment,
    CardGroup,
    Card,
    Icon,
    Form,
    TextArea,
    Button,
    Dropdown,
    Label,
    Item,
} from "semantic-ui-react"

import Navbar from "./navbar"

const tagLegend = [
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

class ProjectInfo extends React.Component{
    constructor(props) {
        super(props)
        this.state = {loadTeam: false}
    }

    componentDidMount() {
        axios.get('projects/'+this.props.project['slug']+'/team/').then((response) => {
            this.setState({
                loadTeam: true,
                projectTeam: response.data,
            })
        }).catch((error) => {
            this.setState({loadTeam: false})
        })
    }

    render(){

        let teamInfo
        if(this.state.loadTeam){
            teamInfo = (
                <Segment>
                    <Header size={"medium"} textAlign={"center"}>Team</Header><hr color={'#111111'}/>
                    <List divided relaxed>
                        {this.state.projectTeam.map((value, index) => {
                            return (
                                <List.Item key={index}>
                                    <List.Content>
                                        <List.Header style={{textAlign: 'center'}}>{value['username']}</List.Header>
                                    </List.Content>
                                </List.Item>
                            )
                        })}
                    </List>
                </Segment>
            )
        }else{
            teamInfo = (
                <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                    <Loader active size="medium" />
                </div>
            )
        }

        return (

            <div style={{zIndex:1, position:"relative", backgroundColor:"#00000099", display: (this.props.isVisible ? "block" : "none")}}>
                <Grid divided style={{minHeight: 'calc(100vh - 66px)', maxHeight: 'calc(100vh - 66px)'}} padded>
                    <Grid.Column width={4} style={{overflowY: 'scroll', maxHeight: 'inherit', backgroundColor:"#000000"}} className={"scrollBar"}>
                        <div>
                            <Header size={"huge"} textAlign={"center"} inverted>
                                {this.props.project['name']}
                                <Icon name={"close"} inverted style={{float: "right"}} link onClick={() => {this.props.onChange({projectDetailsVisible: false})}}/>
                            </Header>
                            <Image wrapped src={this.props.project['image']} bordered /><hr />
                            <p style={{textAlign: 'center', color:'grey'}}>{this.props.project['description']}</p><hr />
                            {teamInfo}<hr />
                        </div>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

class BugList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {loadBugReports: false}
    }

    componentDidMount() {
        axios.get('/projects/'+this.props.slug+'/bugReports/').then((response) => {
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
            return (
                <CardGroup>
                    {this.state.bugReports.map((value, index) => {
                        return (
                            <Card color={value['status'] ? 'green' : 'red'} fluid style={{padding: '0.5em', marginBottom: '0.25em', backgroundColor: "inherit"}} onClick={() => {this.props.onChange({bugReport: value['id']})}} key={index}>
                                <Header size={"small"} style={{margin: 0}}>{value['heading']}</Header>
                                <p style={{color:'grey', marginTop: '5px', marginBottom: '5px'}}>{value['description']}</p>
                                <div>
                                    {this.tagDeHash(value['tagsHash']).map((value1, index1) => {
                                        return (
                                            <Label tag style={{backgroundColor: '#eaeffa', marginBottom: '5px'}}>{tagLegend[value1]}</Label>
                                        )
                                    })}
                                </div>
                            </Card>
                        )
                    })}
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

class NewBugReportForm extends React.Component{

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleImage = (event) => {
        this.setState({image: event.target.files[0]})
    }

    handleDropdown = (event, data) => {
        let x=0
        let tagHash=0
        for(x=0; x<data.value.length; x++){
            tagHash|=(1<<data.value[x])
        }
        this.setState({tagHash: tagHash})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const url = "/bugReports/"
        const formData = new FormData()
        formData.append('project', this.props.project)
        formData.append('heading', this.state.heading)
        formData.append('description', this.state.description)
        formData.append('tagsHash', this.state.tagHash)
        if(typeof this.state.image != 'undefined'){
            formData.append('image', this.state.image)
        }

        const config = {
            headers:{
                'content-type': 'multipart/form-data'
            }
        }

        axios.post(url, formData, config).then((response) => {
            this.props.onChange({bugReport: response.data["id"]})
        })
    }

    render() {
        let tags = tagLegend.map((val, index) => ({
            key: index,
            text: val,
            value: index,
        }))

        return (
            <Segment color={"purple"}>
                <Form onSubmit={this.handleSubmit}>
                    <Header size={"huge"} style={{color: '#800080'}}>New Bug Report</Header>
                    <Form.Field>
                        <label>Title</label>
                        <input placeholder={"Title for Bug Report"} type={"text"} name={"heading"} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <TextArea placeholder={"Description of Bug"} type={"text"} name={"description"} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Tags</label>
                        <Dropdown placeholder={"Tags"} fluid multiple search selection options={tags} onChange={this.handleDropdown} />
                    </Form.Field>
                    <Form.Field>
                        <label>Optional image describing the Bug</label>
                        <input type={"file"} name={"image"} onChange={this.handleImage} accept={"image/png, image/jpeg, image/jpg"} />
                    </Form.Field>
                    <Button type={"submit"}>Report</Button>
                </Form>
            </Segment>
        )
    }
}

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
            let imageExists
            if(this.state.bugReportImage !== null){
                imageExists = (<Item.Image src={this.state.bugReportImage} verticalAlign={'middle'} onClick={() => this.props.onChange({magImage: this.state.bugReportImage})} />)
            }else{
                imageExists = null
            }

            return (
                <div>
                    <Segment raised style={{backgroundColor: (this.state.bugReportStatus ? '#e6ffe6':'#ffe6e6')}}>
                        <Item.Group>
                            <Item>
                                {imageExists}
                                <Item.Content verticalAlign={'middle'}>
                                    <Item.Header style={{fontSize: '2em', lineHeight: '2.2em'}}>{this.state.bugReportHeading}</Item.Header>
                                    <Item.Meta>Reporter: {this.state.bugReportReporter['username']}</Item.Meta>
                                    <Item.Description>
                                        {this.state.bugReportDescription}<br />
                                        <Header as={'h4'} style={{color: (this.state.bugReportPIC === null) ? 'red' : 'green'}}>
                                            Person in charge: {(this.state.bugReportPIC === null) ? "Not assigned" : this.state.bugReportPIC['username']}
                                        </Header>
                                    </Item.Description>
                                    <Item.Extra>
                                        <div>
                                            {this.tagDeHash(this.state.bugReportTagHash).map((value1, index1) => {
                                                return (
                                                    <Label tag style={{backgroundColor: '#eaeffa', marginBottom:'1em'}}>{tagLegend[value1]}</Label>
                                                )
                                            })}
                                        </div>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Segment>
                    <Segment>Comments</Segment>
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