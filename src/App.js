import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import AutContainer from './containers/authContainer';

class App extends Component {
  render() {

    let routes = (
        <Switch>
            <Route path="/" exact component={AutContainer}></Route>
        </Switch>
    )

    return (
      <div className="App">
      {routes}
      </div>
    );
  }
}

export default App;
