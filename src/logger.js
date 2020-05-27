import React from "react"
import queryString from 'querystring'
import {Redirect} from "react-router-dom"
import axios from "axios"
import cookie from "react-cookies"
import {Loader} from "semantic-ui-react"

class Logger extends React.Component{
    constructor(props) {
        super(props)
        this.state = {reqstatus:false, hell:false}
    }

    componentDidMount() {
        const val = queryString.parse(this.props.location.search.slice(1))

        if(val.code == null || val.code === ""){
            this.setState({hell:true})
        }

        if(val.state !== cookie.load('statetoken')){
            this.setState({hell:true})
        }

        const reqconfig = {
            headers: { 'Content-Type': 'application/json' },
        }

        axios.post("/users/token/", JSON.stringify({code: val.code}), reqconfig).then((request)=>{
            this.setState({reqstatus:true})
        }).catch((error) => {
            this.setState({hell:true})
        })

    }

    render(){
        if(this.state.reqstatus){
            cookie.remove('statetoken')
            return <Redirect to="/" />
        }else if(this.state.hell){
            cookie.remove('statetoken')
            return <Redirect to="/login/" />
        }else{
            return (
                <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                    <Loader active size="massive" />
                </div>
            )
        }
    }
}

export default Logger