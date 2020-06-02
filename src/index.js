import React from "react"
import ReactDOM from "react-dom"
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios'

import Login from "./login"
import Landing from "./Landing"
import Logger from "./logger"
import ProjectHandler from "./projectHandler"
import ProjectView from "./projectView";

axios.defaults.baseURL = 'http://localhost:8000/'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

ReactDOM.render((
    <Router>
        <Switch>
            <Route path={"/projects/:slug/"} component={ProjectView} />
            <Route path="/projects/" component={ProjectHandler} />
            <Route path="/login/" component={Login} />
            <Route path="/logger/" component={Logger} />
            <Route path="/" component={Landing} />
        </Switch>
    </Router>
),document.getElementById('root'))