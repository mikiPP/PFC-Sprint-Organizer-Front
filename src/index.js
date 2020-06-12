import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import Axios from 'axios';
import authReducer from './store/reducers/authReducer';
import taskReducer from './store/reducers/taskReducer';
import projectReducer from './store/reducers/projectReducer';
import sprintReducer from './store/reducers/sprintReducer';
import employeeReducer from './store/reducers/employeeReducer';
import roleReducer from './store/reducers/roleReducer';
import statusReducer from './store/reducers/statusReducer';
import permissionReducer from './store/reducers/permissionReducer';
import imputationReducer from './store/reducers/imputationReducer';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

Axios.defaults.headers.post['Content-Type'] = 'application/json';
Axios.defaults.headers.common['Authorization'] = sessionStorage.getItem(
  'token',
);

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  task: taskReducer,
  sprint: sprintReducer,
  employee: employeeReducer,
  role: roleReducer,
  status: statusReducer,
  permission: permissionReducer,
  imputation: imputationReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
