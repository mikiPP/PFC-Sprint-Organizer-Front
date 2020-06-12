import * as actionTypes from '../actionTypes';
import { updateObject } from '../../Utils/objectUtils';

const initialState = {
  fetching: false,
  idsFetched: false,
  error: null,
  spinner: false,
  fetchingImputation: false,
  imputations: null,
  imputation: null,
  mapIdNameImputation: null,
};

const deleteImputation = (state, id) => {
  const imputations = state.imputations.filter((element) => element._id !== id);
  return updateObject(state, {
    fetchingImputation: false,
    imputations,
    imputation: null,
  });
};

const updateImputation = (state, action) => {
  const imputations = [...state.imputations].filter(
    (element) => element._id !== state.imputation._id,
  );
  imputations.push(action.imputation);

  return updateObject(state, {
    imputations,
    imputation: action.imputation,
    fetchingImputation: false,
  });
};

const createImputation = (state, action) => {
  const imputations = state.imputations ? [...state.imputations] : [];
  imputations.push(action.imputation);
  return updateObject(state, { spinner: false, error: null, imputations });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.IMPUTATION_FORM_IDS_START:
      return updateObject(state, {
        fetching: true,
        error: null,
        idsFetched: false,
      });
    case actionTypes.IMPUTATION_FORM_IDS_SUCCESS:
      return updateObject(state, {
        fetching: false,
        error: null,
        idsFetched: true,
      });
    case actionTypes.FETCH_IMPUTATION_FAIL:
      return updateObject(state, {
        fetching: false,
        spinner: false,
        fetchingImputation: false,
        error: action.error,
        imputations: null,
      });
    case actionTypes.FETCH_IMPUTATION_START:
    case actionTypes.CREATE_IMPUTATION_START:
      return updateObject(state, { spinner: true, error: null });
    case actionTypes.FETCH_IMPUTATIONS_SUCCESS:
      return updateObject(state, {
        spinner: false,
        error: null,
        imputations: action.imputations,
      });
    case actionTypes.CREATE_IMPUTATION_SUCCESS:
      return createImputation(state, action);

    case actionTypes.FETCH_IMPUTATION_BY_ID_START:
    case actionTypes.DELETE_IMPUTATION_START:
    case actionTypes.UPDATE_IMPUTATION_START:
      return updateObject(state, { fetchingImputation: true, error: null });

    case actionTypes.DELETE_IMPUTATION: {
      return deleteImputation(state, action.id);
    }

    case actionTypes.FETCH_IMPUTATION_BY_ID_SUCCESS:
      return updateObject(state, {
        fetchingImputation: false,
        imputation: action.imputation,
        error: null,
      });

    case actionTypes.UPDATE_IMPUTATION:
      return updateImputation(state, action);
    case actionTypes.SET_MAP_ID_NAME_IMPUTATION:
      return updateObject(state, { mapIdNameImputation: action.mapIdName });
    default:
      return state;
  }
};

export default reducer;
