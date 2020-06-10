import React, { Component } from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import Auth from './containers/Auth/Auth';
import Index from './components/Index/index';
import Project from './containers/Project/Project';

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
          <Route path="/" exact component={Index}></Route>
          <Redirect to="/project" />
        </Switch>
      );
    }

    return <div className="App">{routes}</div>;
  }
}

export default App;
