import * as actionTypes from '../actionTypes';
import { updateObject } from '../../Utils/objectUtils';

const initialState = {
  fetching: false,
  idsFetched: false,
  error: null,
  spinner: false,
  fetchingTask: false,
  tasks: null,
  task: null,
};

const deleteTask = (state, id) => {
  const tasks = state.tasks.filter((element) => element._id !== id);
  return updateObject(state, {
    fetchingTask: false,
    tasks,
    task: null,
  });
};

const updateTask = (state, action) => {
  const tasks = [...state.tasks].filter(
    (element) => element._id !== state.task._id,
  );
  tasks.push(action.task);

  return updateObject(state, {
    tasks,
    task: action.task,
    fetchingTask: false,
  });
};

const createTask = (state, action) => {
  const tasks = state.tasks ? [...state.tasks] : [];
  tasks.push(action.task);
  return updateObject(state, { spinner: false, error: null, tasks });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_IDS_START:
      return updateObject(state, {
        fetching: true,
        error: null,
        idsFetched: false,
      });
    case actionTypes.FETCH_IDS_SUCCESS:
      return updateObject(state, {
        fetching: false,
        error: null,
        idsFetched: true,
      });
    case actionTypes.FETCH_TASK_FAIL:
      return updateObject(state, {
        fetching: false,
        spinner: false,
        error: action.error,
        tasks: null,
      });
    case actionTypes.FETCH_TASK_START:
    case actionTypes.CREATE_TASK_START:
      return updateObject(state, { spinner: true, error: null });
    case actionTypes.FETCH_TASKS_SUCCESS:
      return updateObject(state, {
        spinner: false,
        error: null,
        tasks: action.tasks,
      });
    case actionTypes.CREATE_TASK_SUCCESS:
      return createTask(state, action);

    case actionTypes.FETCH_TASK_BY_ID_START:
    case actionTypes.DELETE_TASK_START:
    case actionTypes.UPDATE_TASK_START:
      return updateObject(state, { fetchingTask: true, error: null });

    case actionTypes.DELETE_TASK: {
      return deleteTask(state, action.id);
    }

    case actionTypes.FETCH_TASK_BY_ID_SUCCESS:
      return updateObject(state, {
        fetchingTask: false,
        task: action.task,
        error: null,
      });

    case actionTypes.UPDATE_TASK:
      return updateTask(state, action);
    default:
      return state;
  }
};

export default reducer;
