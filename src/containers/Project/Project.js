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
import classes from './project.module.css';
import Loader from '../../components/Loader/loader';
import Modal from '../../components/Modal/modal';

class Project extends Component {
  state = {
    form: {
      name: {
        elementConfig: {
          elementType: 'input',
          type: 'text',
          placeholder: 'Filter Project by Name',
          label: 'Name',
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      productOwner: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Product Owner',
          options: [{ value: '', displayValue: 'Product Owner' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      scrumMaster: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by ScrumMaster',
          options: [{ value: '', displayValue: 'Scrum Master' }],
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
        value: undefined,
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
        valid: false,
        touched: false,
      },
    },
    formIsValid: true,
    formModalIsValid: false,
    projects: null,
    idsNameMap: null,
    show: false,
    modalTitle: null,
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
    const modalTitle =
      event.target.tagName === 'BUTTON' ? 'Add project' : 'Edit project';
    this.setState({ show: true, modalTitle });
  };

  render() {
    let projectContainer = (
      <div>
        <Navbar />
        <div className={[classes.title, 'mt-4'].join(' ')}>
          <h1>Projects</h1>
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
          className={['btn btn-success float-right', classes.addButton].join(
            ' ',
          )}
          onClick={this.handleShow}
        >
          Add new Project
        </Button>
        <Table
          headers={['Name', 'Scrum Master', 'Product Owner']}
          keys={['name', 'scrumMaster', 'productOwner']}
          body={this.props.projects}
          loading={this.props.spinner}
          error={this.props.error}
          controlError={this.props.idsFetched}
          idsNameMap={this.state.idsNameMap}
          handleShow={this.handleShow}
        />

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          title={this.state.modalTitle}
          form={this.state.formModal}
          callback={this.props.createProject}
          formName="formModal"
          formIsValidName="formModalIsValid"
          inputChangedHandler={this.inputChangedHandlerForm}
          checkValidity={checkValidity}
          formValid={this.state.formModalIsValid}
          onSubmit={projectFilterHandler}
          create={false}
          variant="primary"
          buttonText="Create project"
          loading={this.props.spinner}
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
    error: state.project.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchIds: () => dispatch(actions.fetchIds()),
    fetchProjects: (filter) => dispatch(actions.fetchProjects(filter)),
    createProject: (project) => dispatch(actions.createProject(project)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);
