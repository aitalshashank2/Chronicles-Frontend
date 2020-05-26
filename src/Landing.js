import React from "react"
import axios from "axios"
import {Redirect} from "react-router-dom"
import {Container, Loader} from "semantic-ui-react"

import Navbar from "./navbar"
import Projects from "./projects";

class Landing extends React.Component{
    constructor(props) {
        super(props)
        this.state = {user: 'anon', responseRec: false, loggedin:false}
    }

    componentDidMount() {
        axios.get('http://localhost:8000/users/curr/', {withCredentials:true}).then(
            (response) => {
                this.setState({user: response.data.user, responseRec: true, loggedin:true})
            }
        ).catch(error => {
            this.setState({responseRec: true})
        })
    }

    render(){
        if(this.state.responseRec){
            if(!this.state.loggedin){
                return <Redirect to="/login/" />
            }else{
                return (
                    <div>
                        <Navbar user={this.state.user} />
                        <Container>
                            <Projects />
                        </Container>
                    </div>
                )
            }
        }else{
            return (
                <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                    <Loader active size="massive" />
                </div>
            )
        }
    }
}

export default Landing