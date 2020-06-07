import React from "react";
import axios from "axios";
import {Grid, Header, Icon, Image, List, Loader, Segment} from "semantic-ui-react";
import CKeditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
                            {teamInfo}<hr />
                        </div>
                    </Grid.Column>
                    <Grid.Column width={12} style={{overflowY: 'scroll', maxHeight: 'inherit', display: 'flex', alignItems:'center', justifyContent:'center'}} className={"scrollBar"}>
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
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default ProjectInfo
