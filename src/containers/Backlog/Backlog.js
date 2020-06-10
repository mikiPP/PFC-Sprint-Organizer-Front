import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import * as actions from '../../store/index';
import Navbar from '../../components/Navbar/navbar';
import Filters from '../../components/Filters/filters';
import { listToMap } from '../../Utils/objectUtils';
import {
  checkValidity,
  inputChangedHandler,
  projectFilterHandler,
} from '../../Utils/componentUtils';
import Table from '../../components/Table/table';
import Loader from '../../components/Loader/loader';
import Modal from '../../components/Modal/modal';

class Backlog extends Component {
  state = {
    form: {
      name: {
        elementConfig: {
          elementType: 'input',
          type: 'text',
          placeholder: 'Filter Task by Name',
          label: 'Name',
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      Project: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Project',
          options: [{ value: '', displayValue: 'Project' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      backlog: {
        elementConfig: {
          elementType: 'input',
          type: 'checkbox',
          label: 'Filter by Backlog',
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      Creator: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Creator',
          options: [{ value: '', displayValue: 'Creator' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      Realizer: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Realizer',
          options: [{ value: '', displayValue: 'Realizer' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      Sprint: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Sprint',
          options: [{ value: '', displayValue: 'Sprint' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      Status: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Status',
          options: [{ value: '', displayValue: 'Status' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      Type: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Type',
          options: [{ value: '', displayValue: 'Type' }],
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
      productOwner: {
        elementConfig: {
          elementType: 'select',
          label: 'Product Owner',
          options: [{ value: '', displayValue: 'Product Owner' }],
        },
        validation: {
          required: true,
        },
        value: undefined,
        valid: false,
        touched: false,
      },
      scrumMaster: {
        elementConfig: {
          elementType: 'select',
          label: 'ScrumMaster',
          options: [{ value: '', displayValue: 'Scrum Master' }],
        },
        validation: {
          required: true,
        },
        value: undefined,
        valid: false,
        touched: false,
      },
      companyId: {
        elementConfig: {
          elementType: 'select',
          label: 'Company',
          options: [
            { value: '', displayValue: 'Company' },
            { value: '5ec57bd6a31f661b2411e7fc', displayValue: 'companyTest' },
          ],
        },
        validation: {
          required: true,
        },
        value: '5ec57bd6a31f661b2411e7fc',
        valid: true,
        touched: false,
      },
    },
    formIsValid: true,
    formModalIsValid: false,
    projects: null,
    idsNameMap: null,
    show: false,
    modalTitle: null,
    creating: null,
    modalButtonText: '',
    callback: null,
  };

  /** First request get all the employees with role Scrum master and the second one
   * gets the employees with product owner role.
   */

  componentDidMount() {
    this.props
      .fetchIds()
      .then((result) => {
        const newState = Object.assign(this.state, {});

        const scrumMasterIds = [
          ...result[0].data.employees.map((element) => {
            return { value: element._id, displayValue: element.name };
          }),
        ];

        const scrumMasterMap = listToMap(scrumMasterIds);

        const productOwnerIds = [
          ...result[1].data.employees.map((element) => {
            return { value: element._id, displayValue: element.name };
          }),
        ];

        const productOwnerMap = listToMap(productOwnerIds);

        newState.idsNameMap = new Map([...scrumMasterMap, ...productOwnerMap]);

        newState.form.productOwner.elementConfig.options = [
          ...newState.form.productOwner.elementConfig.options,
          ...productOwnerIds,
        ];
        newState.form.scrumMaster.elementConfig.options = [
          ...newState.form.scrumMaster.elementConfig.options,
          ...scrumMasterIds,
        ];

        newState.formModal.productOwner.elementConfig.options = [
          ...newState.formModal.productOwner.elementConfig.options,
          ...productOwnerIds,
        ];
        newState.formModal.scrumMaster.elementConfig.options = [
          ...newState.formModal.scrumMaster.elementConfig.options,
          ...scrumMasterIds,
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
      modalTitle = 'Add project';
      modalButtonText = 'Create project';
      creating = true;
      callback = this.createProject;
    } else {
      modalTitle = 'Edit project';
      modalButtonText = 'Edit project';
      creating = false;
      callback = this.updateProject;
    }
    this.setState({
      show: true,
      modalTitle,
      modalButtonText,
      creating,
      callback,
    });
  };

  openProject = (event) => {
    this.handleShow(event);
    this.props
      .fetchProjectById(event.target.closest('tr').id)
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

  deleteProject = () => {
    this.props
      .deleteProject(this.props.project._id)
      .then(() => this.handleClose());
  };

  createProject = (event) => {
    return projectFilterHandler(
      event,
      this.state.formModal,
      this.props.createProject,
      false,
    );
  };

  updateProject = (event) => {
    return projectFilterHandler(
      event,
      this.state.formModal,
      this.props.updateProject,
      this.props.project._id,
    );
  };

  render() {
    let projectContainer = (
      <div>
        <Navbar />
        <div className="title mt-4">
          <h1>Backlog</h1>
        </div>
        <Filters
          form={this.state.form}
          callback={this.props.fetchProjects}
          formName="form"
          formIsValidName="formIsValid"
          inputChangedHandler={this.inputChangedHandlerForm}
          checkValidity={checkValidity}
          formValid={this.state.formIsValid}
          onSubmit={projectFilterHandler}
          error={this.props.error}
          controlError={this.props.idsFetched}
          submitButton={true}
        />
        <Button
          className="btn btn-success float-right addButton"
          onClick={this.handleShow}
        >
          Add new Task
        </Button>
        <Table
          headers={['Name', 'Scrum Master', 'Product Owner']}
          keys={['name', 'scrumMaster', 'productOwner']}
          body={this.props.projects}
          loading={this.props.spinner}
          error={this.props.error}
          controlError={this.props.idsFetched}
          idsNameMap={this.state.idsNameMap}
          openProject={this.openProject}
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
          onSubmit={projectFilterHandler}
          buttonText={this.state.modalButtonText}
          creating={this.state.creating}
          loading={this.props.spinner}
          fetchingProject={this.props.fetchingProject}
          deleteFunction={this.deleteProject}
        ></Modal>
      </div>
    );

    if (this.props.loading) {
      projectContainer = (
        <div>
          <Loader />
        </div>
      );
    }
    return projectContainer;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.project.fetching,
    spinner: state.project.spinner,
    idsFetched: state.project.idsFetched,
    projects: state.project.projects,
    project: state.project.project,
    error: state.project.error,
    fetchingProject: state.project.fetchingProject,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchIds: () => dispatch(actions.fetchIds()),
    fetchProjects: (filter) => dispatch(actions.fetchProjects(filter)),
    createProject: (project) => dispatch(actions.createProject(project)),
    fetchProjectById: (id) => dispatch(actions.fetchProjectById(id)),
    deleteProject: (id) => dispatch(actions.deleteProject(id)),
    updateProject: (project, id) =>
      dispatch(actions.updateProject(project, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Backlog);
