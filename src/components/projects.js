import React from "react"
import axios from 'axios'
import {CardGroup, Loader, Card, Image, Header} from "semantic-ui-react";
import projectLogo from "./static/projectLogo.gif"

import "../style/utility.css"
import "../style/projects.css"

class Projects extends React.Component{
    constructor(props) {
        super(props)
        this.state = {proj: [], recRes: false}
    }

    componentDidMount() {
        axios.get('/projects/').then(
            (response) => {
                this.setState({proj: response.data})
                this.setState({recRes: true})
            }
        )
    }

    render(){
        if(this.state.recRes){
            if(this.state.proj.length === 0){
                return (
                    <div>
                        <div className={"flex_centered width_full_percent crux"}>
                            <div>
                                <img src={projectLogo} type={"image/gif"} alt={"Chronicles"} />
                                <Header size={"huge"} content={"Chronicles"} color={"purple"} textAlign={'center'} className={"class_margin_bottom"}/>
                                <Header size={"tiny"} content={"A place where Bugs perish"} textAlign={'center'} className={"class_margin_top"}/>
                            </div>
                        </div>
                    </div>
                )
            }
            return (
                <CardGroup centered>
                    {this.state.proj.map((value, index) => {
                        return (
                            <Card color="purple" href={"/projects/"+value['slug']+"/"} key={index}>
                                <Image src={value['image']} wrapped ui={false} />
                                <Card.Content>
                                    <Card.Header>{value['name']}</Card.Header>
                                </Card.Content>
                            </Card>
                        )
                    })}

                </CardGroup>
            )

        }else{
            return (
                <div className={"flex_centered"}>
                    <Loader active size={"huge"} />
                </div>
            )
        }
    }
}

export default Projects