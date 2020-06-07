import * as actionTypes from '../actionTypes';
import { updateObject } from '../../Utils/objectUtils';

const initialState = {
  fetching: false,
  idsFetched: false,
  error: null,
  spinner: false,
  projects: null,
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
      return updateObject(state, { spinner: false, error: null });
    default:
      return state;
  }
};

export default reducer;
