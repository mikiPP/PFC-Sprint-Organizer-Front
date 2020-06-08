import * as actionTypes from '../actionTypes';
import { updateObject } from '../../Utils/objectUtils';

const initialState = {
  userId: null,
  userLoged: false,
  companyId: null,
  name: null,
  error: null,
  loading: false,
  loginFailed: false,
};

const authStart = (state, action) => {
  return updateObject(state, action);
};

const login = (state, action) => {
  return updateObject(state, action.authData);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, { error: null, loading: true });
    case actionTypes.LOGIN_SUCCESS:
      return login(state, action);

    case actionTypes.SIGN_UP_SUCCESS:
      return authStart(state, { error: null, loading: false });

    case actionTypes.AUTH_FAIL:
      return authStart(state, {
        error: action.error,
        loginFailed: action.loginFailed,
        loading: false,
      });
    default:
      return state;
  }
};

export default reducer;
