import * as actionTypes from '../actionTypes';
import axios from 'axios';

export const fetchFail = (error) => {
  return {
    type: actionTypes.FETCH_STATUS_FAIL,
    error,
  };
};

export const fetchStatuses = (filter) => {
  return (dispatch) => {
    dispatch(fetchStatusesStart());
    return axios
      .post('/status/filter', filter)
      .then((result) =>
        dispatch(fetchStatusesSuccesesfull(result.data.statuses)),
      )
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.data.mesesage
              ? err.response.data.mesesage
              : err.response.statusText,
          ),
        ),
      );
  };
};

export const fetchStatusesStart = () => {
  return {
    type: actionTypes.FETCH_STATUS_START,
  };
};

export const fetchStatusesSuccesesfull = (statuses) => {
  return {
    type: actionTypes.FETCH_STATUSES_SUCCESS,
    statuses,
  };
};

export const createStatus = (status) => {
  return (dispatch) => {
    dispatch(createStatusStart());
    return axios
      .post('/status/', status)
      .then((result) => dispatch(createStatusSucceses(result.data.status)))
      .catch((err) => {
        console.error(err);
        return dispatch(
          fetchFail(
            err.response.data.mesesage
              ? err.response.data.mesesage
              : err.response.statusText,
          ),
        );
      });
  };
};

export const createStatusStart = () => {
  return {
    type: actionTypes.CREATE_STATUS_START,
  };
};

export const createStatusSucceses = (status) => {
  return {
    type: actionTypes.CREATE_STATUS_SUCCESS,
    status,
  };
};

export const fetchStatusById = (id) => {
  return (dispatch) => {
    dispatch(fetchStatusByIdStart());
    return axios
      .get(`/status/${id}`)
      .then((result) => {
        dispatch(fetchStatusByIdSucceses(result.data.status));
        return new Promise((resolve) => resolve(result.data.status));
      })
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.data.mesesage
              ? err.response.data.mesesage
              : err.response.statusText,
          ),
        ),
      );
  };
};

export const fetchStatusByIdStart = () => {
  return {
    type: actionTypes.FETCH_STATUS_BY_ID_START,
  };
};

export const fetchStatusByIdSucceses = (status) => {
  return {
    type: actionTypes.FETCH_STATUS_BY_ID_SUCCESS,
    status,
  };
};

export const deleteStatus = (id) => {
  return (dispatch) => {
    dispatch(deleteStatusStart());

    return axios
      .delete(`/status/${id}`)
      .then(
        (result) =>
          new Promise((resolve) => resolve(dispatch(deleteStatusSucceses(id)))),
      )
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.statusText
              ? err.response.statusText
              : err.response.data.mesesage,
          ),
        ),
      );
  };
};

export const deleteStatusStart = () => {
  return {
    type: actionTypes.DELETE_STATUS_START,
  };
};

export const deleteStatusSucceses = (id) => {
  return {
    type: actionTypes.DELETE_STATUS,
    id,
  };
};

export const updateStatus = (status, id) => {
  return (dispatch) => {
    dispatch(updateStatusStart());
    return axios
      .put(`/status/${id}`, status)
      .then((result) => {
        return dispatch(updateStatusSucceses(result.data.status));
      })
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.statusText
              ? err.response.statusText
              : err.response.data.mesesage,
          ),
        ),
      );
  };
};

export const updateStatusStart = () => {
  return {
    type: actionTypes.UPDATE_STATUS_START,
  };
};

export const updateStatusSucceses = (status) => {
  return {
    type: actionTypes.UPDATE_STATUS,
    status,
  };
};
