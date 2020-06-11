import * as actionTypes from '../actionTypes';
import { updateObject } from '../../Utils/objectUtils';

const initialState = {
  fetching: false,
  idsFetched: false,
  error: null,
  spinner: false,
  fetchingSprint: false,
  sprints: null,
  sprint: null,
  mapIdNameSprint: null,
};

const deleteSprint = (state, id) => {
  const sprints = state.sprints.filter((element) => element._id !== id);
  return updateObject(state, {
    fetchingSprint: false,
    sprints,
    sprint: null,
  });
};

const updateSprint = (state, action) => {
  const sprints = [...state.sprints].filter(
    (element) => element._id !== state.sprint._id,
  );
  sprints.push(action.sprint);

  return updateObject(state, {
    sprints,
    sprint: action.sprint,
    fetchingSprint: false,
  });
};

const createSprint = (state, action) => {
  const sprints = state.sprints ? [...state.sprints] : [];
  sprints.push(action.sprint);
  return updateObject(state, { spinner: false, error: null, sprints });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SPRINT_FORM_IDS_START:
      return updateObject(state, {
        fetching: true,
        error: null,
        idsFetched: false,
      });
    case actionTypes.SPRINT_FORM_IDS_SUCCESS:
      return updateObject(state, {
        fetching: false,
        error: null,
        idsFetched: true,
      });
    case actionTypes.FETCH_SPRINT_FAIL:
      return updateObject(state, {
        fetching: false,
        spinner: false,
        error: action.error,
        sprints: null,
      });
    case actionTypes.FETCH_SPRINT_START:
    case actionTypes.CREATE_SPRINT_START:
      return updateObject(state, { spinner: true, error: null });
    case actionTypes.FETCH_SPRINTS_SUCCESS:
      return updateObject(state, {
        spinner: false,
        error: null,
        sprints: action.sprints,
      });
    case actionTypes.CREATE_SPRINT_SUCCESS:
      return createSprint(state, action);

    case actionTypes.FETCH_SPRINT_BY_ID_START:
    case actionTypes.DELETE_SPRINT_START:
    case actionTypes.UPDATE_SPRINT_START:
      return updateObject(state, { fetchingSprint: true, error: null });

    case actionTypes.DELETE_SPRINT: {
      return deleteSprint(state, action.id);
    }

    case actionTypes.FETCH_SPRINT_BY_ID_SUCCESS:
      return updateObject(state, {
        fetchingSprint: false,
        sprint: action.sprint,
        error: null,
      });

    case actionTypes.UPDATE_SPRINT:
      return updateSprint(state, action);
    case actionTypes.SET_MAP_ID_NAME_SPRINT:
      return updateObject(state, { mapIdNameSprint: action.mapIdName });
    default:
      return state;
  }
};

export default reducer;
