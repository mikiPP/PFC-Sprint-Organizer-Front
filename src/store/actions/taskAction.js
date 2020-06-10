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
    type: actionTypes.FETCH_TASK_FAIL,
    error,
  };
};

export const fetchFormTaskIds = () => {
  return (dispatch) => {
    dispatch(fetchIdsStart());
    return Promise.all([
      axios.post('/employee/filter', {
        companyId: sessionStorage.getItem('companyId'),
      }),
      axios.post('/project/filter', {
        companyId: sessionStorage.getItem('companyId'),
      }),
      axios.post('/status/filter', {
        companyId: sessionStorage.getItem('companyId'),
      }),
      axios.post('/sprint/filter', {
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

export const fetchTasks = (filter) => {
  return (dispatch) => {
    dispatch(fetchTasksStart());
    return axios
      .post('task/filter', filter)
      .then((result) => dispatch(fetchTasksSuccessfull(result.data.tasks)))
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

export const fetchTasksStart = () => {
  return {
    type: actionTypes.FETCH_TASK_START,
  };
};

export const fetchTasksSuccessfull = (tasks) => {
  return {
    type: actionTypes.FETCH_TASKS_SUCCESS,
    tasks,
  };
};

export const createTask = (task) => {
  return (dispatch) => {
    dispatch(createTaskStart());
    return axios
      .post('task/', task)
      .then((result) => dispatch(createTaskSuccess(result.data.task)))
      .catch((err) => {
        console.error(err);
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

export const createTaskStart = () => {
  return {
    type: actionTypes.CREATE_TASK_START,
  };
};

export const createTaskSuccess = (task) => {
  return {
    type: actionTypes.CREATE_TASK_SUCCESS,
    task,
  };
};

export const fetchTaskById = (id) => {
  return (dispatch) => {
    dispatch(fetchTaskByIdStart());
    return axios
      .get(`task/${id}`)
      .then((result) => {
        dispatch(fetchTaskByIdSuccess(result.data.task));
        return new Promise((resolve) => resolve(result.data.task));
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

export const fetchTaskByIdStart = () => {
  return {
    type: actionTypes.FETCH_TASK_BY_ID_START,
  };
};

export const fetchTaskByIdSuccess = (task) => {
  return {
    type: actionTypes.FETCH_TASK_BY_ID_SUCCESS,
    task,
  };
};

export const deleteTask = (id) => {
  return (dispatch) => {
    dispatch(deleteTaskStart());

    return axios
      .delete(`task/${id}`)
      .then(
        (result) =>
          new Promise((resolve) => resolve(dispatch(deleteTaskSuccess(id)))),
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

export const deleteTaskStart = () => {
  return {
    type: actionTypes.DELETE_TASK_START,
  };
};

export const deleteTaskSuccess = (id) => {
  return {
    type: actionTypes.DELETE_TASK,
    id,
  };
};

export const updateTask = (task, id) => {
  return (dispatch) => {
    dispatch(updateTaskStart());
    return axios
      .put(`task/${id}`, task)
      .then((result) => {
        return dispatch(updateTaskSuccess(result.data.task));
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

export const updateTaskStart = () => {
  return {
    type: actionTypes.UPDATE_TASK_START,
  };
};

export const updateTaskSuccess = (task) => {
  return {
    type: actionTypes.UPDATE_TASK,
    task,
  };
};
