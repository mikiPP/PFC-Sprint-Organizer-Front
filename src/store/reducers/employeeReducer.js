import * as actionTypes from '../actionTypes';
import { updateObject } from '../../Utils/objectUtils';

const initialState = {
  fetching: false,
  idsFetched: false,
  error: null,
  spinner: false,
  fetchingEmployee: false,
  employees: null,
  employee: null,
};

const deleteEmployee = (state, id) => {
  const employees = state.employees.filter((element) => element._id !== id);
  return updateObject(state, {
    fetchingEmployee: false,
    employees,
    employee: null,
  });
};

const updateEmployee = (state, action) => {
  const employees = [...state.employees].filter(
    (element) => element._id !== state.employee._id,
  );
  employees.push(action.employee);

  return updateObject(state, {
    employees,
    employee: action.employee,
    fetchingEmployee: false,
  });
};

const createEmployee = (state, action) => {
  const employees = state.employees ? [...state.employees] : [];
  employees.push(action.employee);
  return updateObject(state, { spinner: false, error: null, employees });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EMPLOYEE_FORM_IDS_START:
      return updateObject(state, {
        fetching: true,
        error: null,
        idsFetched: false,
      });
    case actionTypes.EMPLOYEE_FORM_IDS_SUCCESS:
      return updateObject(state, {
        fetching: false,
        error: null,
        idsFetched: true,
      });
    case actionTypes.FETCH_EMPLOYEE_FAIL:
      return updateObject(state, {
        fetching: false,
        spinner: false,
        error: action.error,
        employees: null,
      });
    case actionTypes.FETCH_EMPLOYEE_START:
    case actionTypes.CREATE_EMPLOYEE_START:
      return updateObject(state, { spinner: true, error: null });
    case actionTypes.FETCH_EMPLOYEES_SUCCESS:
      return updateObject(state, {
        spinner: false,
        error: null,
        employees: action.employees,
      });
    case actionTypes.CREATE_EMPLOYEE_SUCCESS:
      return createEmployee(state, action);

    case actionTypes.FETCH_EMPLOYEE_BY_ID_START:
    case actionTypes.DELETE_EMPLOYEE_START:
    case actionTypes.UPDATE_EMPLOYEE_START:
      return updateObject(state, { fetchingEmployee: true, error: null });

    case actionTypes.DELETE_EMPLOYEE: {
      return deleteEmployee(state, action.id);
    }

    case actionTypes.FETCH_EMPLOYEE_BY_ID_SUCCESS:
      return updateObject(state, {
        fetchingEmployee: false,
        employee: action.employee,
        error: null,
      });

    case actionTypes.UPDATE_EMPLOYEE:
      return updateEmployee(state, action);
    default:
      return state;
  }
};

export default reducer;
