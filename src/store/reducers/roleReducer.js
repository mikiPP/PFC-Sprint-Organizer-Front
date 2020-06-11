import * as actionTypes from '../actionTypes';
import { updateObject } from '../../Utils/objectUtils';

const initialState = {
  fetching: false,
  idsFetched: false,
  error: null,
  spinner: false,
  fetchingRole: false,
  roles: null,
  role: null,
};

const deleteRole = (state, id) => {
  const roles = state.roles.filter((element) => element._id !== id);
  return updateObject(state, {
    fetchingRole: false,
    roles,
    role: null,
  });
};

const updateRole = (state, action) => {
  const roles = [...state.roles].filter(
    (element) => element._id !== state.role._id,
  );
  roles.push(action.role);

  return updateObject(state, {
    roles,
    role: action.role,
    fetchingRole: false,
  });
};

const createRole = (state, action) => {
  const roles = state.roles ? [...state.roles] : [];
  roles.push(action.role);
  return updateObject(state, { spinner: false, error: null, roles });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ROLE_FAIL:
      return updateObject(state, {
        fetching: false,
        spinner: false,
        error: action.error,
        roles: null,
      });
    case actionTypes.FETCH_ROLE_START:
    case actionTypes.CREATE_ROLE_START:
      return updateObject(state, { spinner: true, error: null });
    case actionTypes.FETCH_ROLES_SUCCESS:
      return updateObject(state, {
        spinner: false,
        error: null,
        roles: action.roles,
      });
    case actionTypes.CREATE_ROLE_SUCCESS:
      return createRole(state, action);

    case actionTypes.FETCH_ROLE_BY_ID_START:
    case actionTypes.DELETE_ROLE_START:
    case actionTypes.UPDATE_ROLE_START:
      return updateObject(state, { fetchingRole: true, error: null });

    case actionTypes.DELETE_ROLE: {
      return deleteRole(state, action.id);
    }

    case actionTypes.FETCH_ROLE_BY_ID_SUCCESS:
      return updateObject(state, {
        fetchingRole: false,
        role: action.role,
        error: null,
      });

    case actionTypes.UPDATE_ROLE:
      return updateRole(state, action);
    default:
      return state;
  }
};

export default reducer;
