import * as actionTypes from '../actionTypes';
import axios from 'axios';

export const fetchFail = (error) => {
  return {
    type: actionTypes.FETCH_ROLE_FAIL,
    error,
  };
};

export const fetchRoles = (filter) => {
  return (dispatch) => {
    dispatch(fetchRolesStart());
    return axios
      .post('/api/role/filter', filter)
      .then((result) => dispatch(fetchRolesSuccesesfull(result.data.roles)))
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.data.mesesage
              ? err.response.data.mesesage
              : err.response.roleText,
          ),
        ),
      );
  };
};

export const fetchRolesStart = () => {
  return {
    type: actionTypes.FETCH_ROLE_START,
  };
};

export const fetchRolesSuccesesfull = (roles) => {
  return {
    type: actionTypes.FETCH_ROLES_SUCCESS,
    roles,
  };
};

export const createRole = (role) => {
  return (dispatch) => {
    dispatch(createRoleStart());
    return axios
      .post('/api/role/', role)
      .then((result) => dispatch(createRoleSucceses(result.data.role)))
      .catch((err) => {
        console.error(err);
        return dispatch(
          fetchFail(
            err.response.data.mesesage
              ? err.response.data.mesesage
              : err.response.roleText,
          ),
        );
      });
  };
};

export const createRoleStart = () => {
  return {
    type: actionTypes.CREATE_ROLE_START,
  };
};

export const createRoleSucceses = (role) => {
  return {
    type: actionTypes.CREATE_ROLE_SUCCESS,
    role,
  };
};

export const fetchRoleById = (id) => {
  return (dispatch) => {
    dispatch(fetchRoleByIdStart());
    return axios
      .get(`/api/role/${id}`)
      .then((result) => {
        dispatch(fetchRoleByIdSucceses(result.data.role));
        return new Promise((resolve) => resolve(result.data.role));
      })
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.data.mesesage
              ? err.response.data.mesesage
              : err.response.roleText,
          ),
        ),
      );
  };
};

export const fetchRoleByIdStart = () => {
  return {
    type: actionTypes.FETCH_ROLE_BY_ID_START,
  };
};

export const fetchRoleByIdSucceses = (role) => {
  return {
    type: actionTypes.FETCH_ROLE_BY_ID_SUCCESS,
    role,
  };
};

export const deleteRole = (id) => {
  return (dispatch) => {
    dispatch(deleteRoleStart());

    return axios
      .delete(`/api/role/${id}`)
      .then(
        (result) =>
          new Promise((resolve) => resolve(dispatch(deleteRoleSucceses(id)))),
      )
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.roleText
              ? err.response.roleText
              : err.response.data.mesesage,
          ),
        ),
      );
  };
};

export const deleteRoleStart = () => {
  return {
    type: actionTypes.DELETE_ROLE_START,
  };
};

export const deleteRoleSucceses = (id) => {
  return {
    type: actionTypes.DELETE_ROLE,
    id,
  };
};

export const updateRole = (role, id) => {
  return (dispatch) => {
    dispatch(updateRoleStart());
    return axios
      .put(`/api/role/${id}`, role)
      .then((result) => {
        return dispatch(updateRoleSucceses(result.data.role));
      })
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.roleText
              ? err.response.roleText
              : err.response.data.mesesage,
          ),
        ),
      );
  };
};

export const updateRoleStart = () => {
  return {
    type: actionTypes.UPDATE_ROLE_START,
  };
};

export const updateRoleSucceses = (role) => {
  return {
    type: actionTypes.UPDATE_ROLE,
    role,
  };
};
