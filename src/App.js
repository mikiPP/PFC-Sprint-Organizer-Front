import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import './App.css';
import Auth from './containers/Auth/Auth';
import Index from './components/Index/index';
import Project from './containers/Project/Project';
import Backlog from './containers/Backlog/Backlog';
import Sprint from './containers/Sprint/Sprint';
import Employee from './containers/Employee/Employee';
import Status from './containers/Status/Status';
import Role from './containers/Role/Role';
import Permission from './containers/Permission/Permission';
import Imputation from './containers/Imputation/Imputation';
import AssigmentProject from './containers/AssigmentProject/AssigmentProject';

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
          <Route path="/sprint" component={Sprint}></Route>
          <Route path="/employee" component={Employee}></Route>
          <Route path="/status" component={Status}></Route>
          <Route path="/role" component={Role}></Route>
          <Route path="/permission" component={Permission}></Route>
          <Route path="/imputation" component={Imputation}></Route>
          <Route
            path="/assigmentProject/:id"
            component={AssigmentProject}
          ></Route>
          <Route path="/" exact component={Index}></Route>
          <Redirect to="/project" />
        </Switch>
      );
    }

    return <div className="App">{routes}</div>;
  }
}

export default App;
