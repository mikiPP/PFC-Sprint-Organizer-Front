import React, { Component } from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import Auth from './containers/Auth/Auth';
import Index from './components/Index/index';
import Navbar from './components/Navbar/navbar';

class App extends Component {
  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={Auth}></Route>
        <Route path="/navbar" component={Navbar}></Route>
        <Route path="/" exact component={Index}></Route>
        <Redirect to="/" />
      </Switch>
    );

    return <div className="App">{routes}</div>;
  }
}

export default App;
