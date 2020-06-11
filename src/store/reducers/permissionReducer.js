import * as actionTypes from '../actionTypes';
import { updateObject } from '../../Utils/objectUtils';

const initialState = {
  fetching: false,
  idsFetched: false,
  error: null,
  spinner: false,
  fetchingPermission: false,
  permissions: null,
  permission: null,
};

const deletePermission = (state, id) => {
  const permissions = state.permissions.filter((element) => element._id !== id);
  return updateObject(state, {
    fetchingPermission: false,
    permissions,
    permission: null,
  });
};

const updatePermission = (state, action) => {
  const permissions = [...state.permissions].filter(
    (element) => element._id !== state.permission._id,
  );
  permissions.push(action.permission);

  return updateObject(state, {
    permissions,
    permission: action.permission,
    fetchingPermission: false,
  });
};

const createPermission = (state, action) => {
  const permissions = state.permissions ? [...state.permissions] : [];
  permissions.push(action.permission);
  return updateObject(state, { spinner: false, error: null, permissions });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PERMISSION_FAIL:
      return updateObject(state, {
        fetching: false,
        spinner: false,
        error: action.error,
        permissions: null,
      });
    case actionTypes.FETCH_PERMISSION_START:
    case actionTypes.CREATE_PERMISSION_START:
      return updateObject(state, { spinner: true, error: null });
    case actionTypes.FETCH_PERMISSIONS_SUCCESS:
      return updateObject(state, {
        spinner: false,
        error: null,
        permissions: action.permissions,
      });
    case actionTypes.CREATE_PERMISSION_SUCCESS:
      return createPermission(state, action);

    case actionTypes.FETCH_PERMISSION_BY_ID_START:
    case actionTypes.DELETE_PERMISSION_START:
    case actionTypes.UPDATE_PERMISSION_START:
      return updateObject(state, { fetchingPermission: true, error: null });

    case actionTypes.DELETE_PERMISSION: {
      return deletePermission(state, action.id);
    }

    case actionTypes.FETCH_PERMISSION_BY_ID_SUCCESS:
      return updateObject(state, {
        fetchingPermission: false,
        permission: action.permission,
        error: null,
      });

    case actionTypes.UPDATE_PERMISSION:
      return updatePermission(state, action);
    default:
      return state;
  }
};

export default reducer;
