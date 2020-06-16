import React from "react"
import axios from 'axios'
import {CardGroup, Loader, Card, Image, Header} from "semantic-ui-react";
import projectLogo from "./projectLogo.gif"

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
                        <div style={{display:"flex", alignItems: "center", justifyContent: "center", height: '90vh', width: '100%'}}>
                            <div>
                                <img src={projectLogo} type={"image/gif"} alt={"Chronicles"} />
                                <Header size={"huge"} content={"Chronicles"} color={"purple"} textAlign={'center'} style={{marginBottom: '0'}}/>
                                <Header size={"tiny"} content={"A place where Bugs perish"} textAlign={'center'} style={{marginTop: '0'}}/>
                            </div>
                        </div>
                    </div>
                )
            }
            return (
                <CardGroup itemsPerRow={4}>
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
                <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                    <Loader active size={"huge"} />
                </div>
            )
        }
    }
}

export default Projects