import * as actionTypes from '../actionTypes';
import { updateObject } from '../../Utils/objectUtils';

const initialState = {
  fetching: false,
  idsFetched: false,
  error: null,
  spinner: false,
  fetchingStatus: false,
  statuses: null,
  status: null,
};

const deleteStatus = (state, id) => {
  const statuses = state.statuses.filter((element) => element._id !== id);
  return updateObject(state, {
    fetchingStatus: false,
    statuses,
    status: null,
  });
};

const updateStatus = (state, action) => {
  const statuses = [...state.statuses].filter(
    (element) => element._id !== state.status._id,
  );
  statuses.push(action.status);

  return updateObject(state, {
    statuses,
    status: action.status,
    fetchingStatus: false,
  });
};

const createStatus = (state, action) => {
  const statuses = state.statuses ? [...state.statuses] : [];
  statuses.push(action.status);
  return updateObject(state, { spinner: false, error: null, statuses });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_STATUS_FAIL:
      return updateObject(state, {
        fetching: false,
        spinner: false,
        error: action.error,
        statuses: null,
      });
    case actionTypes.FETCH_STATUS_START:
    case actionTypes.CREATE_STATUS_START:
      return updateObject(state, { spinner: true, error: null });
    case actionTypes.FETCH_STATUSES_SUCCESS:
      return updateObject(state, {
        spinner: false,
        error: null,
        statuses: action.statuses,
      });
    case actionTypes.CREATE_STATUS_SUCCESS:
      return createStatus(state, action);

    case actionTypes.FETCH_STATUS_BY_ID_START:
    case actionTypes.DELETE_STATUS_START:
    case actionTypes.UPDATE_STATUS_START:
      return updateObject(state, { fetchingStatus: true, error: null });

    case actionTypes.DELETE_STATUS: {
      return deleteStatus(state, action.id);
    }

    case actionTypes.FETCH_STATUS_BY_ID_SUCCESS:
      return updateObject(state, {
        fetchingStatus: false,
        status: action.status,
        error: null,
      });

    case actionTypes.UPDATE_STATUS:
      return updateStatus(state, action);
    default:
      return state;
  }
};

export default reducer;
