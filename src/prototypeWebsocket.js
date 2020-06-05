import React from "react"

class PrototypeWebsocket extends React.Component{
    constructor(props) {
        super(props);
        this.state = {message: ''}
    }


    ws = new WebSocket("ws://localhost:8000/ws/bugReport/1/")

    componentDidMount() {
        this.ws.onopen = () => {
            console.log("connected")
        }

        this.ws.onmessage = evt => {
            const message = JSON.parse(evt.data)
            this.setState({dataFromServer: message})
            console.log(message)
        }
    }

    handleChange = (event) => {
        this.setState({'message': event.target.value})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.ws.send(JSON.stringify({message: this.state.message}))
    }

    render(){
        return (
            <form onSubmit={this.handleSubmit}>
                <input type={"text"} onChange={this.handleChange} />
                <input type={"submit"} value={"submit"} />
            </form>

        )
    }
}

export default PrototypeWebsocket