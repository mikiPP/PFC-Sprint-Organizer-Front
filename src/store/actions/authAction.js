import * as actionTypes from '../actionTypes';
import axios from 'axios';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const signUpSuccess = () => {
  return {
    type: actionTypes.SIGN_UP_SUCCESS,
    loading: false,
  };
};

export const signUp = (userData) => {
  return (dispatch) => {
    dispatch(authStart());
    userData.companyId = '5ec57bd6a31f661b2411e7fc';
    axios
      .post('/auth/signUp', userData)
      .then((response) => {
        dispatch(signUpSuccess());
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          authFail(
            `${err.response.data.message} ${err.response.data.data[0].msg}`,
            false,
          ),
        );
      });
  };
};

export const authSuccess = (authData) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    authData,
  };
};
export const authFail = (error, login) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error,
    loginFailed: login,
  };
};

export const auth = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    const data = { email, password };
    axios
      .post('/auth/login', data)
      .then((response) => {
        const data = decodeToken(response.data.token);
        addDataToLocalStorage(data, response.data.token);
        dispatch(authSuccess(data));
      })
      .catch((err) => {
        console.error(err);
        dispatch(authFail(err.response.data.message, true));
      });
  };
};

function decodeToken(token) {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const result = { ...decodedToken };

    delete result.iat;
    delete result.exp;

    result.loading = false;
    result.userLoged = true;

    return result;
  } catch (e) {
    return null;
  }
}

function addDataToLocalStorage(data, token) {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('userId', data.userId);
  sessionStorage.setItem('companyId', data.companyId);
  sessionStorage.setItem('name', data.name);
}
