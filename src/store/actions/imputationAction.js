import axios from 'axios';
import moment from 'moment';
import * as actionTypes from '../actionTypes';

export const fetchIdsStart = () => {
  return {
    type: actionTypes.IMPUTATION_FORM_IDS_START,
  };
};

export const fetchIdsSuccessfull = () => {
  return {
    type: actionTypes.IMPUTATION_FORM_IDS_SUCCESS,
  };
};

export const fetchFail = (error) => {
  return {
    type: actionTypes.FETCH_FAIL,
    error,
  };
};

export const fetchFormImputationIds = () => {
  return (dispatch) => {
    dispatch(fetchIdsStart());
    return Promise.all([
      axios.post('/employee/filter', {
        companyId: sessionStorage.getItem('companyId'),
      }),
      axios.post('/task/filter', {
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

export const fetchImputations = (filter) => {
  return (dispatch) => {
    dispatch(fetchImputationsStart());
    if (filter.date) {
      filter.date = {
        $gte: filter.date,
        $lte: moment(filter.date, 'YYYY-MM-DD').add('days', 1),
      };
    }
    return axios
      .post('/imputation/filter', filter)
      .then((result) => {
        formatDate(result.data.imputations, 'DD-MM-YYYY');
        return dispatch(fetchImputationsSuccessfull(result.data.imputations));
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

export const fetchImputationsStart = () => {
  return {
    type: actionTypes.FETCH_IMPUTATION_START,
  };
};

export const fetchImputationsSuccessfull = (imputations) => {
  return {
    type: actionTypes.FETCH_IMPUTATIONS_SUCCESS,
    imputations: imputations,
  };
};

export const createImputation = (imputation) => {
  return (dispatch) => {
    dispatch(createImputationStart());
    return axios
      .post('/imputation/', imputation)
      .then((result) =>
        dispatch(createImputationSuccess(result.data.imputation)),
      )
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

export const createImputationStart = () => {
  return {
    type: actionTypes.CREATE_IMPUTATION_START,
  };
};

export const createImputationSuccess = (imputation) => {
  return {
    type: actionTypes.CREATE_IMPUTATION_SUCCESS,
    imputation,
  };
};

export const fetchImputationById = (id) => {
  return (dispatch) => {
    dispatch(fetchImputationByIdStart());
    return axios
      .get(`/imputation/${id}`)
      .then((result) => {
        const imputation = result.data.imputation;
        formatDate([imputation], 'YYYY-MM-DD');
        dispatch(fetchImputationByIdSuccess(imputation));
        return new Promise((resolve) => resolve(imputation));
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

export const fetchImputationByIdStart = () => {
  return {
    type: actionTypes.FETCH_IMPUTATION_BY_ID_START,
  };
};

export const fetchImputationByIdSuccess = (imputation) => {
  return {
    type: actionTypes.FETCH_IMPUTATION_BY_ID_SUCCESS,
    imputation,
  };
};

export const deleteImputation = (id) => {
  return (dispatch) => {
    dispatch(deleteImputationStart());

    return axios
      .delete(`/imputation/${id}`)
      .then(
        (result) =>
          new Promise((resolve) =>
            resolve(dispatch(deleteImputationSuccess(id))),
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

export const deleteImputationStart = () => {
  return {
    type: actionTypes.DELETE_IMPUTATION_START,
  };
};

export const deleteImputationSuccess = (id) => {
  return {
    type: actionTypes.DELETE_IMPUTATION,
    id,
  };
};

export const updateImputation = (imputation, id) => {
  return (dispatch) => {
    dispatch(updateImputationStart());
    return axios
      .put(`/imputation/${id}`, imputation)
      .then((result) => {
        const imputation = result.data.imputation;
        formatDate([imputation], 'DD-MM-YYYY');
        return dispatch(updateImputationSuccess(imputation));
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

export const updateImputationStart = () => {
  return {
    type: actionTypes.UPDATE_IMPUTATION_START,
  };
};

export const updateImputationSuccess = (imputation) => {
  return {
    type: actionTypes.UPDATE_IMPUTATION,
    imputation,
  };
};

export const setMapIdsNamesImputation = (map) => {
  return {
    type: actionTypes.SET_MAP_ID_NAME_IMPUTATION,
    mapIdName: map,
  };
};

export const formatDate = (imputations, formater) => {
  return imputations.forEach((element) => {
    element.date = moment(element.date).format(formater);
  });
};
