import React from "react";
import axios from "axios";
import {Redirect} from "react-router-dom";
import {Button, Loader} from "semantic-ui-react";

class Landing extends React.Component{
    constructor(props) {
        super(props);
        this.state = {user: 'anon', responseRec: false, loggedin:false}
    }

    componentDidMount() {
        axios.get('http://localhost:8000/users/curr/', {withCredentials:true}).then(
            (response) => {
                    this.setState({user: response.data.user, responseRec: true, loggedin:true});
            }
        ).catch(error => {
            this.setState({responseRec: true});
        })
    }

    render(){
        if(this.state.responseRec){
            if(!this.state.loggedin){
                return <Redirect to="/login/" />
            }else{
                return (
                    <div>
                        <h1>{this.state.user}</h1><br/>
                        <Button loading color={'blue'} inverted>Loading</Button>
                    </div>
                );
            }
        }else{
            return (
                <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                    <Loader active size="massive" />
                </div>
            );
        }
    }
}

export default Landing;