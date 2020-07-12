import React from "react"
import ReactDOM from "react-dom"
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios'

import Login from "./components/miscellaneous/login"
import Landing from "./components/Landing"
import Logger from "./components/miscellaneous/logger"
import ProjectHandler from "./components/projectHandler"
import ProjectView from "./components/projectView"
import AdminView from "./components/adminView"
import MyChores from "./components/myChores"

axios.defaults.baseURL = 'http://localhost:8000/'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

ReactDOM.render((
    <Router>
        <Switch>
            <Route exact path={"/my_chores/"} component={MyChores} />
            <Route exact path={"/admin/"} component={AdminView} />
            <Route exact path={"/projects/:slug/"} component={ProjectView} />
            <Route exact path={"/projects/"} component={ProjectHandler} />
            <Route exact path={"/login/"} component={Login} />
            <Route exact path={"/logger/"} component={Logger} />
            <Route exact path={"/"} component={Landing} />
        </Switch>
    </Router>
),document.getElementById('root'))
