import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'

import Login from "./login";
import Landing from "./Landing";
import Logger from "./logger";

ReactDOM.render((
    <Router>
        <Switch>
            <Route path="/login/" component={Login}></Route>
            <Route path="/logger/" component={Logger}></Route>
            <Route path="/" component={Landing}></Route>
        </Switch>
    </Router>
),document.getElementById('root'));