import * as actionTypes from '../actionTypes';
import axios from 'axios';

export const fetchIdsStart = () => {
  return {
    type: actionTypes.EMPLOYEE_FORM_IDS_START,
  };
};

export const fetchIdsSuccessfull = () => {
  return {
    type: actionTypes.EMPLOYEE_FORM_IDS_SUCCESS,
  };
};

export const fetchFail = (error) => {
  return {
    type: actionTypes.FETCH_EMPLOYEE_FAIL,
    error,
  };
};

export const fetchFormEmployeeIds = () => {
  return (dispatch) => {
    dispatch(fetchIdsStart());
    return Promise.all([
      axios.get(`/company/${sessionStorage.getItem('companyId')}`),
      axios.post('/project/filter', {
        companyId: sessionStorage.getItem('companyId'),
      }),
      axios.post('/role/filter', {
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

export const fetchEmployees = (filter) => {
  return (dispatch) => {
    dispatch(fetchEmployeesStart());
    return axios
      .post('employee/filter', filter)
      .then((result) =>
        dispatch(fetchEmployeesSuccessfull(result.data.employees)),
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

export const fetchEmployeesStart = () => {
  return {
    type: actionTypes.FETCH_EMPLOYEE_START,
  };
};

export const fetchEmployeesSuccessfull = (employees) => {
  return {
    type: actionTypes.FETCH_EMPLOYEES_SUCCESS,
    employees,
  };
};

export const createEmployee = (employee) => {
  return (dispatch) => {
    dispatch(createEmployeeStart());
    return axios
      .post('employee/', employee)
      .then((result) => dispatch(createEmployeeSuccess(result.data.employee)))
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

export const createEmployeeStart = () => {
  return {
    type: actionTypes.CREATE_EMPLOYEE_START,
  };
};

export const createEmployeeSuccess = (employee) => {
  return {
    type: actionTypes.CREATE_EMPLOYEE_SUCCESS,
    employee,
  };
};

export const fetchEmployeeById = (id) => {
  return (dispatch) => {
    dispatch(fetchEmployeeByIdStart());
    return axios
      .get(`employee/${id}`)
      .then((result) => {
        dispatch(fetchEmployeeByIdSuccess(result.data.employee));
        return new Promise((resolve) => resolve(result.data.employee));
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

export const fetchEmployeeByIdStart = () => {
  return {
    type: actionTypes.FETCH_EMPLOYEE_BY_ID_START,
  };
};

export const fetchEmployeeByIdSuccess = (employee) => {
  return {
    type: actionTypes.FETCH_EMPLOYEE_BY_ID_SUCCESS,
    employee,
  };
};

export const deleteEmployee = (id) => {
  return (dispatch) => {
    dispatch(deleteEmployeeStart());

    return axios
      .delete(`employee/${id}`)
      .then(
        (result) =>
          new Promise((resolve) =>
            resolve(dispatch(deleteEmployeeSuccess(id))),
          ),
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

export const deleteEmployeeStart = () => {
  return {
    type: actionTypes.DELETE_EMPLOYEE_START,
  };
};

export const deleteEmployeeSuccess = (id) => {
  return {
    type: actionTypes.DELETE_EMPLOYEE,
    id,
  };
};

export const updateEmployee = (employee, id) => {
  return (dispatch) => {
    dispatch(updateEmployeeStart());
    return axios
      .put(`employee/${id}`, employee)
      .then((result) => {
        return dispatch(updateEmployeeSuccess(result.data.employee));
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

export const updateEmployeeStart = () => {
  return {
    type: actionTypes.UPDATE_EMPLOYEE_START,
  };
};

export const updateEmployeeSuccess = (employee) => {
  return {
    type: actionTypes.UPDATE_EMPLOYEE,
    employee,
  };
};

export const setMapIdsNamesEmployee = (map) => {
  return {
    type: actionTypes.SET_MAP_ID_NAME_EMPLOYEE,
    mapIdName: map,
  };
};
