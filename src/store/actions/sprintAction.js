import * as actionTypes from '../actionTypes';
import moment from 'moment';
import axios from 'axios';

export const fetchIdsStart = () => {
  return {
    type: actionTypes.SPRINT_FORM_IDS_START,
  };
};

export const fetchIdsSuccessfull = () => {
  return {
    type: actionTypes.SPRINT_FORM_IDS_SUCCESS,
  };
};

export const fetchFail = (error) => {
  return {
    type: actionTypes.FETCH_SPRINT_FAIL,
    error,
  };
};

export const fetchFormSprintIds = () => {
  return (dispatch) => {
    dispatch(fetchIdsStart());
    return Promise.all([
      axios.post('project/filter', {
        companyId: sessionStorage.getItem('companyId'),
      }),
      axios.post('status/filter', {
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

export const fetchSprints = (filter) => {
  return (dispatch) => {
    dispatch(fetchSprintsStart());
    if (filter.startDate) {
      filter.startDate = {
        $gte: filter.startDate,
        $lte: moment(filter.startDate, 'YYYY-MM-DD').add('days', 1),
      };
    }

    if (filter.endDate) {
      filter.endDate = {
        $gte: filter.endDate,
        $lte: moment(filter.endDate, 'YYYY-MM-DD').add('days', 1),
      };
    }

    return axios
      .post('sprint/filter', filter)
      .then((result) => {
        formatDate(result.data.sprints, 'DD-MM-YYYY');
        return dispatch(fetchSprintsSuccessfull(result.data.sprints));
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

export const fetchSprintsStart = () => {
  return {
    type: actionTypes.FETCH_SPRINT_START,
  };
};

export const fetchSprintsSuccessfull = (sprints) => {
  return {
    type: actionTypes.FETCH_SPRINTS_SUCCESS,
    sprints,
  };
};

export const createSprint = (sprint) => {
  return (dispatch) => {
    dispatch(createSprintStart());
    return axios
      .post('sprint/', sprint)
      .then((result) => dispatch(createSprintSuccess(result.data.sprint)))
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

export const createSprintStart = () => {
  return {
    type: actionTypes.CREATE_SPRINT_START,
  };
};

export const createSprintSuccess = (sprint) => {
  return {
    type: actionTypes.CREATE_SPRINT_SUCCESS,
    sprint,
  };
};

export const fetchSprintById = (id) => {
  return (dispatch) => {
    dispatch(fetchSprintByIdStart());
    return axios
      .get(`sprint/${id}`)
      .then((result) => {
        formatDate([result.data.sprint], 'YYYY-MM-DD');
        dispatch(fetchSprintByIdSuccess(result.data.sprint));
        return new Promise((resolve) => resolve(result.data.sprint));
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

export const fetchSprintByIdStart = () => {
  return {
    type: actionTypes.FETCH_SPRINT_BY_ID_START,
  };
};

export const fetchSprintByIdSuccess = (sprint) => {
  return {
    type: actionTypes.FETCH_SPRINT_BY_ID_SUCCESS,
    sprint,
  };
};

export const deleteSprint = (id) => {
  return (dispatch) => {
    dispatch(deleteSprintStart());

    return axios
      .delete(`sprint/${id}`)
      .then(
        (result) =>
          new Promise((resolve) => resolve(dispatch(deleteSprintSuccess(id)))),
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

export const deleteSprintStart = () => {
  return {
    type: actionTypes.DELETE_SPRINT_START,
  };
};

export const deleteSprintSuccess = (id) => {
  return {
    type: actionTypes.DELETE_SPRINT,
    id,
  };
};

export const updateSprint = (sprint, id) => {
  return (dispatch) => {
    dispatch(updateSprintStart());
    return axios
      .put(`sprint/${id}`, sprint)
      .then((result) => {
        formatDate([result.data.sprint], 'DD-MM-YYYY');
        return dispatch(updateSprintSuccess(result.data.sprint));
      })
      .catch((err) => {
        console.error(err);
        return dispatch(
          fetchFail(
            err.response.statusText
              ? err.response.statusText
              : err.response.data.message,
          ),
        );
      });
  };
};

export const updateSprintStart = () => {
  return {
    type: actionTypes.UPDATE_SPRINT_START,
  };
};

export const updateSprintSuccess = (sprint) => {
  return {
    type: actionTypes.UPDATE_SPRINT,
    sprint,
  };
};

export const formatDate = (sprints, formater) => {
  return sprints.forEach((element) => {
    element.startDate = moment(element.startDate).format(formater);
    element.endDate = moment(element.endDate).format(formater);
  });
};

export const setMapIdsNamesSprint = (map) => {
  return {
    type: actionTypes.SET_MAP_ID_NAME_SPRINT,
    mapIdName: map,
  };
};

export const fetchOptionsSprint = (id) => {
  return (dispatch) => {
    dispatch(fetchOptionsStart());
    return Promise.all([
      axios.post('employee/filter', {
        companyId: sessionStorage.getItem('companyId'),
      }),
      axios.post('task/filter', {
        companyId: sessionStorage.getItem('companyId'),
      }),
      axios.get(`sprint/${id}`, {
        companyId: sessionStorage.getItem('companyId'),
      }),
    ])
      .then(
        (response) =>
          new Promise((resolve) => {
            dispatch(fetchOptionsSuccess());
            return resolve(response);
          }),
      )
      .catch((err) => {
        return new Promise((reject) => {
          dispatch(
            fetchFail(
              err.response.statusText
                ? err.response.statusText
                : err.response.data.message,
            ),
          );
          return reject(err);
        });
      });
  };
};

export const fetchOptionsStart = () => {
  return {
    type: actionTypes.FETCH_SPRINT_OPTIONS_START,
  };
};

export const fetchOptionsSuccess = () => {
  return {
    type: actionTypes.FETCH_SPRINT_OPTIONS_SUCCESS,
  };
};

export const updateAssigmentSprint = (
  keys,
  valuesToSend,
  valuesToRemove,
  sprint,
) => {
  return (dispatch) => {
    dispatch(updateAssigmentStart());
    valuesToSend.forEach((element, index) => {
      sprint[`${keys[index]}s`] = [...sprint[`${keys[index]}s`], ...element];
    });

    valuesToRemove.forEach((element, index) => {
      element.forEach((innerElement) => {
        sprint[`${keys[index]}s`] = sprint[`${keys[index]}s`].filter(
          (filter) => filter !== innerElement._id,
        );
      });
    });

    axios
      .put(`sprint/${sprint._id}`, sprint)
      .then((result) => dispatch(updateAssigmentSuccess()))
      .catch((err) => {
        console.log(err);
        return dispatch(fetchFail(err));
      });
  };
};

const updateAssigmentSuccess = () => {
  return {
    type: actionTypes.UPDATE_SPRINT_ASSIGMENT_SUCCESS,
  };
};

const updateAssigmentStart = () => {
  return {
    type: actionTypes.UPDATE_SPRINT_ASSIGMENT_START,
  };
};
