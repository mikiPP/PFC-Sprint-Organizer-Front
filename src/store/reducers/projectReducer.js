import * as actionTypes from '../actionTypes';
import { updateObject } from '../../Utils/objectUtils';

const initialState = {
  fetching: false,
  idsFetched: false,
  error: null,
  spinner: false,
  fetchingProject: false,
  projects: null,
  project: null,
};

const deleteProject = (state, id) => {
  const projects = state.projects.filter((element) => element._id !== id);
  return updateObject(state, {
    fetchingProject: false,
    projects,
    project: null,
  });
};

const updateProject = (state, action) => {
  const projects = [...state.projects].filter(
    (element) => element._id !== state.project._id,
  );

  console.log(projects);
  projects.push(action.project);

  return updateObject(state, {
    projects,
    project: null,
    fetchingProject: false,
  });
};

const createProject = (state, action) => {
  const projects = state.projects ? [...state.projects] : [];
  projects.push(action.project);
  return updateObject(state, { spinner: false, error: null, projects });
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
    case actionTypes.FETCH_FAIL:
      return updateObject(state, {
        fetching: false,
        spinner: false,
        error: action.error,
        projects: null,
      });
    case actionTypes.FETCH_PROJECT_START:
    case actionTypes.CREATE_PROJECT_START:
      return updateObject(state, { spinner: true, error: null });
    case actionTypes.FETCH_PROJECTS_SUCCESS:
      return updateObject(state, {
        spinner: false,
        error: null,
        projects: action.projects,
      });
    case actionTypes.CREATE_PROJECT_SUCCESS:
      return createProject(state, action);

    case actionTypes.FETCH_PROJECT_BY_ID_START:
    case actionTypes.DELETE_PROJECT_START:
    case actionTypes.UPDATE_PROJECT_START:
      return updateObject(state, { fetchingProject: true, error: null });

    case actionTypes.DELETE_PROJECT: {
      return deleteProject(state, action.id);
    }

    case actionTypes.FETCH_PROJECT_BY_ID_SUCCESS:
      return updateObject(state, {
        fetchingProject: false,
        project: action.project,
        error: null,
      });

    case actionTypes.UPDATE_PROJECT:
      return updateProject(state, action);
    default:
      return state;
  }
};

export default reducer;
