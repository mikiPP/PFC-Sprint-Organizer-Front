import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import * as actions from '../../store/index';
import Navbar from '../../components/Navbar/navbar';
import Filters from '../../components/Filters/filters';
import { listToMap } from '../../Utils/objectUtils';
import {
  checkValidity,
  inputChangedHandler,
  filterHandler,
} from '../../Utils/componentUtils';
import Table from '../../components/Table/table';
import Loader from '../../components/Loader/loader';
import Modal from '../../components/Modal/modal';

class Sprint extends Component {
  state = {
    form: {
      name: {
        elementConfig: {
          elementType: 'input',
          type: 'text',
          placeholder: 'Filter Sprint by Name',
          label: 'Name',
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      projectId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Project',
          options: [{ value: '', displayValue: 'Project' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      startDate: {
        elementConfig: {
          elementType: 'input',
          type: 'date',
          placeholder: 'Start Date',
          label: 'Filter Start Date',
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      endDate: {
        elementConfig: {
          elementType: 'input',
          type: 'date',
          placeholder: 'End Date',
          label: 'Filter End Date',
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      statusId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Status',
          options: [{ value: '', displayValue: 'Status' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
    },
    formModal: {
      name: {
        elementConfig: {
          elementType: 'input',
          type: 'text',
          placeholder: ' Name',
          label: 'Name',
        },
        validation: {
          required: true,
        },
        value: '',
        valid: false,
        touched: false,
      },
      description: {
        elementConfig: {
          elementType: 'input',
          type: 'text',
          placeholder: ' Description',
          label: 'Description',
        },
        validation: {
          required: true,
        },
        value: '',
        valid: false,
        touched: false,
      },
      projectId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Project',
          options: [{ value: '', displayValue: 'Project' }],
        },
        validation: {
          required: true,
        },
        value: undefined,
        valid: false,
        touched: false,
      },
      statusId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Status',
          options: [{ value: '', displayValue: 'Status' }],
        },
        validation: {
          required: true,
        },
        value: undefined,
        valid: false,
        touched: false,
      },
      startDate: {
        elementConfig: {
          elementType: 'input',
          type: 'date',
          placeholder: 'Start date',
          label: 'Start date',
        },
        validation: {
          required: true,
        },
        value: '',
        valid: false,
        touched: false,
      },
      endDate: {
        elementConfig: {
          elementType: 'input',
          type: 'date',
          placeholder: 'End date',
          label: 'End date',
        },
        validation: {
          required: true,
        },
        value: '',
        valid: false,
        touched: false,
      },
    },

    formIsValid: true,
    formModalIsValid: false,
    sprints: null,
    show: false,
    modalTitle: null,
    creating: null,
    modalButtonText: '',
    callback: null,
    redirect: false,
  };

  /** First request get all the employees with role Scrum master and the second one
   * gets the employees with product owner role.
   */

  componentDidMount() {
    this.props
      .fetchFormSprintIds()
      .then((result) => {
        const newState = Object.assign(this.state, {});

        const projectIds = [
          ...result[0].data.projects.map((element) => {
            return { value: element._id, displayValue: element.name };
          }),
        ];

        const projectMap = listToMap(projectIds);

        const statusIds = [
          ...result[1].data.statuses.map((element) => {
            return { value: element._id, displayValue: element.name };
          }),
        ];

        const statusMap = listToMap(statusIds);

        this.props.setMapIdNameSprint(new Map([...projectMap, ...statusMap]));

        newState.form.projectId.elementConfig.options = [
          ...newState.form.projectId.elementConfig.options,
          ...projectIds,
        ];

        newState.form.statusId.elementConfig.options = [
          ...newState.form.statusId.elementConfig.options,
          ...statusIds,
        ];

        newState.formModal.projectId.elementConfig.options = [
          ...newState.formModal.projectId.elementConfig.options,
          ...projectIds,
        ];

        newState.formModal.statusId.elementConfig.options = [
          ...newState.formModal.statusId.elementConfig.options,
          ...statusIds,
        ];

        this.setState(newState);
      })
      .catch((err) => console.error(err));
    // this will be handled by redux
  }

  inputChangedHandlerForm = (
    event,
    inputIdentifier,
    form,
    formName,
    formIsValidName,
  ) => {
    const result = inputChangedHandler(event, inputIdentifier, form);

    const stateCloned = Object.assign(this.state, {});
    stateCloned[formName] = result.form;
    stateCloned[formIsValidName] = result.formIsValid;

    this.setState(stateCloned);
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = (event) => {
    let modalTitle;
    let modalButtonText;
    let creating;
    let callback;

    if (event.target.tagName === 'BUTTON') {
      modalTitle = 'Add sprint';
      modalButtonText = 'Create sprint';
      creating = true;
      callback = this.createSprint;
    } else {
      modalTitle = 'Edit sprint';
      modalButtonText = 'Edit sprint';
      creating = false;
      callback = this.updateSprint;
    }
    this.setState({
      show: true,
      modalTitle,
      modalButtonText,
      creating,
      callback,
    });
  };

  openSprint = (event) => {
    this.handleShow(event);
    this.props
      .fetchSprintById(event.target.closest('tr').id)
      .then((formValues) =>
        this.updateForm(this.state.formModal, 'formModal', formValues),
      );
  };

  updateForm = (form, formName, formValues) => {
    const stateCloned = Object.assign(this.state, {});

    Object.keys(form).forEach((key) => {
      stateCloned[formName][key].value = formValues[key];
      stateCloned[formName][key].valid = true;
    });

    stateCloned[`${formName}IsValid`] = true;
    stateCloned.creating = false;

    this.setState(stateCloned);
  };

  deleteSprint = () => {
    this.props
      .deleteSprint(this.props.sprint._id)
      .then(() => this.handleClose());
  };

  createSprint = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.createSprint,
      false,
    );
  };

  updateSprint = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.updateSprint,
      this.props.sprint._id,
    );
  };

  assigmentFunction = () => {
    this.setState({ redirect: true });
  };

  render() {
    let sprintContainer = (
      <div>
        <Navbar />
        <div className="title mt-4">
          <h1>Sprint</h1>
        </div>
        <Filters
          form={this.state.form}
          callback={this.props.fetchSprints}
          formName="form"
          formIsValidName="formIsValid"
          inputChangedHandler={this.inputChangedHandlerForm}
          checkValidity={checkValidity}
          formValid={this.state.formIsValid}
          onSubmit={filterHandler}
          error={this.props.error}
          controlError={this.props.idsFetched}
          submitButton={true}
        />
        <Button
          className="btn btn-success float-right addButton"
          onClick={this.handleShow}
        >
          Add new Sprint
        </Button>
        <Table
          headers={[
            'Name',
            'Description',
            'Project',
            'Status',
            'Start Date',
            'End Date',
          ]}
          keys={[
            'name',
            'description',
            'projectId',
            'statusId',
            'startDate',
            'endDate',
          ]}
          body={this.props.sprints}
          loading={this.props.spinner}
          error={this.props.error}
          controlError={this.props.idsFetched}
          idsNameMap={this.props.mapIdNameSprint}
          open={this.openSprint}
        />

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          title={this.state.modalTitle}
          form={this.state.formModal}
          callback={this.state.callback}
          formName="formModal"
          formIsValidName="formModalIsValid"
          inputChangedHandler={this.inputChangedHandlerForm}
          checkValidity={checkValidity}
          formValid={this.state.formModalIsValid}
          onSubmit={filterHandler}
          buttonText={this.state.modalButtonText}
          creating={this.state.creating}
          loading={this.props.spinner}
          fetching={this.props.fetchingSprint}
          deleteFunction={this.deleteSprint}
          assigment={this.state.callback === this.updateSprint}
          assigmentFunction={this.assigmentFunction}
        ></Modal>
      </div>
    );

    if (this.props.loading) {
      sprintContainer = (
        <div>
          <Loader />
        </div>
      );
    }

    if (this.state.redirect) {
      this.setState({ redirect: false });
      sprintContainer = (
        <div>
          <Redirect to={`assigmentSprint/${this.props.sprint._id}`} />
        </div>
      );
    }
    return sprintContainer;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.sprint.fetching,
    spinner: state.sprint.spinner,
    idsFetched: state.sprint.idsFetched,
    sprints: state.sprint.sprints,
    sprint: state.sprint.sprint,
    error: state.sprint.error,
    fetchingSprint: state.sprint.fetchingSprint,
    mapIdNameSprint: state.sprint.mapIdNameSprint,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFormSprintIds: () => dispatch(actions.fetchFormSprintIds()),
    fetchSprints: (filter) => dispatch(actions.fetchSprints(filter)),
    createSprint: (sprint) => dispatch(actions.createSprint(sprint)),
    fetchSprintById: (id) => dispatch(actions.fetchSprintById(id)),
    deleteSprint: (id) => dispatch(actions.deleteSprint(id)),
    setMapIdNameSprint: (map) => dispatch(actions.setMapIdsNamesSprint(map)),
    updateSprint: (sprint, id) => dispatch(actions.updateSprint(sprint, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sprint);
