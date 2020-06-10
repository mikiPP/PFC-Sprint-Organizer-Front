import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import './App.css';
import Auth from './containers/Auth/Auth';
import Index from './components/Index/index';
import Project from './containers/Project/Project';
import Backlog from './containers/Backlog/Backlog';

class App extends Component {
  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={Auth}></Route>
        <Route path="/" exact component={Index}></Route>
        <Redirect to="/" />
      </Switch>
    );

    if (sessionStorage.getItem('logged')) {
      routes = (
        <Switch>
          <Route path="/auth" component={Auth}></Route>
          <Route path="/project" component={Project}></Route>
          <Route path="/backlog" component={Backlog}></Route>
          <Route path="/" exact component={Index}></Route>
          <Redirect to="/project" />
        </Switch>
      );
    }

    return <div className="App">{routes}</div>;
  }
}

export default App;
