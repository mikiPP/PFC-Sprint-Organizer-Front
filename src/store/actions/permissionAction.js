import * as actionTypes from '../actionTypes';
import axios from 'axios';

export const fetchFail = (error) => {
  return {
    type: actionTypes.FETCH_PERMISSION_FAIL,
    error,
  };
};

export const fetchPermissions = (filter) => {
  return (dispatch) => {
    dispatch(fetchPermissionsStart());
    return axios
      .post('/permission/filter', filter)
      .then((result) =>
        dispatch(fetchPermissionsSuccesesfull(result.data.permissions)),
      )
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.data.mesesage
              ? err.response.data.mesesage
              : err.response.permissionText,
          ),
        ),
      );
  };
};

export const fetchPermissionsStart = () => {
  return {
    type: actionTypes.FETCH_PERMISSION_START,
  };
};

export const fetchPermissionsSuccesesfull = (permissions) => {
  return {
    type: actionTypes.FETCH_PERMISSIONS_SUCCESS,
    permissions,
  };
};

export const createPermission = (permission) => {
  return (dispatch) => {
    dispatch(createPermissionStart());
    return axios
      .post('/permission/', permission)
      .then((result) =>
        dispatch(createPermissionSucceses(result.data.permission)),
      )
      .catch((err) => {
        console.error(err);
        return dispatch(
          fetchFail(
            err.response.data.mesesage
              ? err.response.data.mesesage
              : err.response.permissionText,
          ),
        );
      });
  };
};

export const createPermissionStart = () => {
  return {
    type: actionTypes.CREATE_PERMISSION_START,
  };
};

export const createPermissionSucceses = (permission) => {
  return {
    type: actionTypes.CREATE_PERMISSION_SUCCESS,
    permission,
  };
};

export const fetchPermissionById = (id) => {
  return (dispatch) => {
    dispatch(fetchPermissionByIdStart());
    return axios
      .get(`/permission/${id}`)
      .then((result) => {
        dispatch(fetchPermissionByIdSucceses(result.data.permission));
        return new Promise((resolve) => resolve(result.data.permission));
      })
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.data.mesesage
              ? err.response.data.mesesage
              : err.response.permissionText,
          ),
        ),
      );
  };
};

export const fetchPermissionByIdStart = () => {
  return {
    type: actionTypes.FETCH_PERMISSION_BY_ID_START,
  };
};

export const fetchPermissionByIdSucceses = (permission) => {
  return {
    type: actionTypes.FETCH_PERMISSION_BY_ID_SUCCESS,
    permission,
  };
};

export const deletePermission = (id) => {
  return (dispatch) => {
    dispatch(deletePermissionStart());

    return axios
      .delete(`/permission/${id}`)
      .then(
        (result) =>
          new Promise((resolve) =>
            resolve(dispatch(deletePermissionSucceses(id))),
          ),
      )
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.permissionText
              ? err.response.permissionText
              : err.response.data.mesesage,
          ),
        ),
      );
  };
};

export const deletePermissionStart = () => {
  return {
    type: actionTypes.DELETE_PERMISSION_START,
  };
};

export const deletePermissionSucceses = (id) => {
  return {
    type: actionTypes.DELETE_PERMISSION,
    id,
  };
};

export const updatePermission = (permission, id) => {
  return (dispatch) => {
    dispatch(updatePermissionStart());
    return axios
      .put(`/permission/${id}`, permission)
      .then((result) => {
        return dispatch(updatePermissionSucceses(result.data.permission));
      })
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.permissionText
              ? err.response.permissionText
              : err.response.data.mesesage,
          ),
        ),
      );
  };
};

export const updatePermissionStart = () => {
  return {
    type: actionTypes.UPDATE_PERMISSION_START,
  };
};

export const updatePermissionSucceses = (permission) => {
  return {
    type: actionTypes.UPDATE_PERMISSION,
    permission,
  };
};
