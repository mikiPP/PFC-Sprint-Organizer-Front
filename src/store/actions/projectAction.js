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
      .then((result) => dispatch(createProjectSuccess(result.data.Project)))
      .catch((err) => {
        console.log(err);
        return dispatch(
          fetchFail(
            err.response.data.message
              ? err.response.data.message
              : err.response.statusText,
          ),
        );
      });
  };
};

export const createProjectStart = () => {
  return {
    type: actionTypes.CREATE_PROJECT_START,
  };
};

export const createProjectSuccess = (project) => {
  return {
    type: actionTypes.CREATE_PROJECT_SUCCESS,
    project,
  };
};

export const fetchProjectById = (id) => {
  return (dispatch) => {
    dispatch(fetchProjectByIdStart());
    return axios
      .get(`project/${id}`)
      .then((result) => {
        dispatch(fetchProjectByIdSuccess(result.data.project));
        return new Promise((resolve) => resolve(result.data.project));
      })
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

export const fetchProjectByIdStart = () => {
  return {
    type: actionTypes.FETCH_PROJECT_BY_ID_START,
  };
};

export const fetchProjectByIdSuccess = (project) => {
  return {
    type: actionTypes.FETCH_PROJECT_BY_ID_SUCCESS,
    project,
  };
};

export const deleteProject = (id) => {
  return (dispatch) => {
    dispatch(deleteProjectStart());

    return axios
      .delete(`project/${id}`)
      .then(
        (result) =>
          new Promise((resolve) => resolve(dispatch(deleteProjectSuccess(id)))),
      )
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.statusText
              ? err.response.statusText
              : err.response.data.message,
          ),
        ),
      );
  };
};

export const deleteProjectStart = () => {
  return {
    type: actionTypes.DELETE_PROJECT_START,
  };
};

export const deleteProjectSuccess = (id) => {
  return {
    type: actionTypes.DELETE_PROJECT,
    id,
  };
};

export const updateProject = (project, id) => {
  return (dispatch) => {
    dispatch(updateProjectStart());
    return axios
      .put(`project/${id}`, project)
      .then((result) => {
        console.log(result);
        return dispatch(updateProjectSuccess(result.data.project));
      })
      .catch((err) =>
        dispatch(
          fetchFail(
            err.response.statusText
              ? err.response.statusText
              : err.response.data.message,
          ),
        ),
      );
  };
};

export const updateProjectStart = () => {
  return {
    type: actionTypes.UPDATE_PROJECT_START,
  };
};

export const updateProjectSuccess = (project) => {
  return {
    type: actionTypes.UPDATE_PROJECT,
    project,
  };
};
