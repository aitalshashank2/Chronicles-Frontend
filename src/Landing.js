import React from "react"
import {Container} from "semantic-ui-react"

import Navbar from "./navbar"
import Projects from "./projects";

class Landing extends React.Component{
    render(){

        return (
            <div>
                <Navbar /><br />
                <Container>
                    <Projects />
                </Container>
            </div>
        )

    }
}

export default Landing