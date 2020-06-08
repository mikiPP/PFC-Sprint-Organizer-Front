import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import Axios from 'axios';
import authReducer from './store/reducers/authReducer';
import projectReducer from './store/reducers/projectReducer';
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
