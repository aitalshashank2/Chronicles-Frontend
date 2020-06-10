import React from "react"
import axios from 'axios'
import {CardGroup, Loader, Card, Image} from "semantic-ui-react";

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