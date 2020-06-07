import * as actionTypes from '../actionTypes';
import axios from 'axios';

export const fetchIdsStart = () => {
  return {
    type: actionTypes.FETCH_IDS_START,
  };
};

export const fetchIdsSuccessfull = () => {
  return {
    type: actionTypes.FETCH_IDS_SUCCESS,
  };
};

export const fetchFail = (error) => {
  return {
    type: actionTypes.FETCH_FAIL,
    error,
  };
};

export const fetchIds = () => {
  return (dispatch) => {
    dispatch(fetchIdsStart());
    return Promise.all([
      axios.post('/employee/filter', {
        roleId: '5eda8a75d9fd3e0004253c7d',
        companyId: sessionStorage.getItem('companyId'),
      }),
      axios.post('/employee/filter', {
        roleId: '5eda8a88d9fd3e0004253c7e',
        companyId: sessionStorage.getItem('companyId'),
      }),
    ])
      .then((result) => {
        return new Promise((resolve) => {
          dispatch(fetchIdsSuccessfull());
          resolve(result);
        });
      })
      .catch((err) => {
        return new Promise((reject) => {
          dispatch(fetchFail(err.response.data.message));
          reject();
        });
      });
  };
};

export const fetchProjects = (filter) => {
  return (dispatch) => {
    dispatch(fetchProjectsStart());
    return axios
      .post('project/filter', filter)
      .then((result) =>
        dispatch(fetchProjectsSuccessfull(result.data.projects)),
      )
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.data.message
              ? err.response.data.message
              : err.response.statusText,
          ),
        ),
      );
  };
};

export const fetchProjectsStart = () => {
  return {
    type: actionTypes.FETCH_PROJECT_START,
  };
};

export const fetchProjectsSuccessfull = (projects) => {
  return {
    type: actionTypes.FETCH_PROJECTS_SUCCESS,
    projects: projects,
  };
};

export const createProject = (project) => {
  return (dispatch) => {
    dispatch(createProjectStart());
    return axios
      .post('project/', project)
      .then((result) => dispatch(fetchProjectsSuccessfull()))
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.data.message
              ? err.response.data.message
              : err.response.statusText,
          ),
        ),
      );
  };
};

export const createProjectStart = () => {
  return {
    type: actionTypes.CREATE_PROJECT_START,
  };
};

export const createProjectSuccess = () => {
  return {
    type: actionTypes.CREATE_PROJECT_SUCCESS,
  };
};
