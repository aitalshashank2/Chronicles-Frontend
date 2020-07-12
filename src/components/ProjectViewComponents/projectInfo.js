import React from "react";
import axios from "axios";
import {Grid, Header, Icon, Image, List, Loader, Segment, Input, Dropdown, Button} from "semantic-ui-react";
import CKeditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import UploadAdapter from "../miscellaneous/uploadAdapter";

import "../../style/utility.css"
import "../../style/ProjectViewComponents/projectInfo.css"

class ProjectInfo extends React.Component{
    constructor(props) {
        super(props)
        this.state = {loadTeam: false, newLogo: null, loadUsers: false, allUsers: null}
    }

    componentDidMount() {
        this.setState({newProjectTeam: this.props.project['team'], newProjectDescription: this.props.project['description']})

        axios.get('projects/'+this.props.project['id']+'/team/').then((response) => {
            this.setState({
                loadTeam: true,
                projectTeam: response.data,
            })
        }).catch((error) => {
            this.setState({loadTeam: false})
        })

        axios.get('users/').then(res => {
            this.setState({loadUsers: true, allUsers: res.data})
        }).catch(err => {
            this.setState({loadUsers: false})
        })
    }

    handleImage = (event) => {
        this.setState({newLogo: event.target.files[0]})
    }

    handleDropdown = (event, data) => {
        this.setState({newProjectTeam: data.value})
    }

    handlePatch = () => {
        const formData = new FormData()

        if(this.state.newLogo !== null){
            formData.append('image', this.state.newLogo)
        }
        this.state.newProjectTeam.forEach((value) => {
            formData.append('team', value)
        })

        formData.append('description', this.state.newProjectDescription)

        console.log(this.state.newProjectTeam)

        axios.patch('projects/'+this.props.project['slug']+'/', formData).then(res => {
            window.location.reload()
        }).catch(err => {
            console.log("Failure")
        })

        const deleteData = new FormData()
        deleteData.append('randIdentifier', this.state.randIdentifier)
        deleteData.append('urls', this.state.ckeditorURLS)
        axios.post('/images/deleteRem/', deleteData).then((response) => {
            console.log("Success Deleting")
        }).catch(err => {
            console.log('Failure Deleting')
        })
    }

    handleDelete = () => {
        if(this.props.canEdit){
            axios.delete('/projects/'+this.props.project['slug']+'/').then(res=>{
                window.location = "/"
            }).catch(err => {
                console.log("Failed to delete")
            })
        }
    }

    render(){

        let teamInfo, projectLogo, customEditor, deleteOption
        if(this.state.loadTeam && this.state.loadUsers){
            const userOptions = this.state.allUsers.map((val, index) => ({
                key: val['id'],
                text: val['username'],
                value: val['id'],
            }))

            if(this.props.canEdit){
                teamInfo = (
                    <Segment>
                        <Header size={"medium"} textAlign={"center"}>Team</Header><hr color={'#111111'}/>
                        <Dropdown value={this.state.newProjectTeam} placeholder={"Team Members"} fluid multiple search selection options={userOptions} onChange={this.handleDropdown} />
                    </Segment>
                )
            }else{
                teamInfo = (
                    <Segment>
                        <Header size={"medium"} className={"team_item"}>Team</Header><hr color={'#111111'}/>
                        <List divided relaxed>
                            {this.state.projectTeam.map((value, index) => {
                                return (
                                    <List.Item key={index}>
                                        <List.Content>
                                            <List.Header className={"team_item"}>{value['username']}</List.Header>
                                        </List.Content>
                                    </List.Item>
                                )
                            })}
                        </List>
                    </Segment>
                )
            }
        }else{
            teamInfo = (
                <div className={"flex_centered"}>
                    <Loader active size="medium" />
                </div>
            )
        }

        if(this.props.canEdit){
            projectLogo = (
                <Segment className={"project_logo"}>
                    <Header className={"project_logo_header"}>Update Project Logo</Header><hr />
                    <Input className={"project_logo_input"} inverted type={"file"} name={"image"} onChange={this.handleImage} accept={"image/png, image/jpeg, image/jpg"}/>
                </Segment>
            )
            customEditor = (
                <CKeditor
                    editor={ClassicEditor}
                    data={this.props.project['description']}
                    onInit={editor=>{
                        const randIdentifier = this.state.randIdentifier
                        editor.plugins.get('FileRepository').createUploadAdapter = function(loader){
                            return new UploadAdapter(loader, randIdentifier)
                        }
                    }}
                    onChange={(event, editor) => {
                        const ckeditorURLS = Array.from( new DOMParser().parseFromString( editor.getData(), 'text/html' )
                                .querySelectorAll( 'img' ) )
                                .map( img => img.getAttribute( 'src' ) )
                        this.setState({
                            newProjectDescription: editor.getData(),
                            ckeditorURLS: ckeditorURLS,
                        })

                    }}
                />
            )
            deleteOption = (
                <div className={"delete_option width_full_percent"}>
                    <Button inverted color={"red"} onClick={this.handleDelete}>Delete</Button><hr />
                </div>
            )
        }else{
            customEditor = (
                <CKeditor
                    editor={ClassicEditor}
                    data={this.props.project['description']}
                    disabled={true}
                    config={
                        {
                            toolbar: [],
                            isReadOnly: true,
                        }
                    }
                />
            )
        }

        let canSubmit
        if((this.state.newLogo !== null) || (JSON.stringify(this.state.newProjectTeam) !== JSON.stringify(this.props.project['team'])) || (this.state.newProjectDescription !== this.props.project['description'])){
            canSubmit = (
                <Segment textAlign={"center"} inverted>
                    <Button inverted primary onClick={this.handlePatch}>Submit</Button>
                </Segment>
            )
        }else{
            canSubmit = (<div />)
        }

        if(this.props.isMobile){
            return (
                <div className={"dark_bg"}>
                    <Header size={"huge"} textAlign={"center"} inverted>
                        {this.props.project['name']}
                    </Header>
                    <Image wrapped src={this.props.project['image']} bordered /><hr />
                    {projectLogo}<hr />
                    {teamInfo}<hr />
                    {customEditor}<hr />
                    {deleteOption}
                    {canSubmit}
                </div>
            )
        }

        return (

            <div style={{zIndex:10, position:"relative", backgroundColor:"#00000099", display: (this.props.isVisible ? "block" : "none")}}>
                <Grid divided className={"main_crux"} padded stackable>
                    <Grid.Column width={4} className={"scrollBar col1"}>
                        <div>
                            <Header size={"huge"} textAlign={"center"} inverted>
                                {this.props.project['name']}
                                <Icon name={"close"} inverted className={"close_icon"} link onClick={() => {this.props.onChange({projectDetailsVisible: false})}}/>
                            </Header>
                            <Image wrapped src={this.props.project['image']} bordered /><hr />
                            {projectLogo}<hr />
                            {teamInfo}<hr />
                            {deleteOption}
                            {canSubmit}
                        </div>
                    </Grid.Column>
                    <Grid.Column width={12} className={"flex_centered col2"}>
                        <div className={"col2_inner"}>
                            {customEditor}
                        </div>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default ProjectInfo
