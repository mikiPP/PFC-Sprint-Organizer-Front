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
  filterHandler,
} from '../../Utils/componentUtils';
import Table from '../../components/Table/table';
import Loader from '../../components/Loader/loader';
import Modal from '../../components/Modal/modal';

class Imputation extends Component {
  state = {
    form: {
      employeeId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Employee',
          options: [{ value: '', displayValue: 'Employee' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      taskId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by task',
          options: [{ value: '', displayValue: 'Task' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      sprintId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Sprint',
          options: [{ value: '', displayValue: 'Sprint' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      date: {
        elementConfig: {
          elementType: 'input',
          type: 'date',
          placeholder: 'Date',
          label: 'Date',
        },
        value: undefined,
        valid: true,
        touched: false,
      },
    },
    formModal: {
      employeeId: {
        elementConfig: {
          elementType: 'select',
          label: 'Employee',
          options: [{ value: '', displayValue: 'Employee' }],
        },
        validation: {
          required: true,
        },
        value: undefined,
        valid: false,
        touched: false,
      },
      taskId: {
        elementConfig: {
          elementType: 'select',
          label: 'Task',
          options: [{ value: '', displayValue: 'Task' }],
        },
        validation: {
          required: true,
        },
        value: undefined,
        valid: false,
        touched: false,
      },
      sprintId: {
        elementConfig: {
          elementType: 'select',
          label: 'Sprint',
          options: [{ value: '', displayValue: 'Sprint' }],
        },
        validation: {
          required: true,
        },
        value: undefined,
        valid: false,
        touched: false,
      },
      date: {
        elementConfig: {
          elementType: 'input',
          type: 'date',
          placeholder: 'Date',
          label: 'Date',
        },
        validation: {
          required: true,
        },
        value: '',
        valid: false,
        touched: false,
      },
      hours: {
        elementConfig: {
          elementType: 'input',
          type: 'number',
          label: 'Hours',
        },
        validation: {
          required: true,
        },
        value: 0,
        valid: false,
        touched: false,
      },
    },
    formIsValid: true,
    formModalIsValid: false,
    imputations: null,
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

        const employeeIds = [
          ...result[0].data.employees.map((element) => {
            return { value: element._id, displayValue: element.name };
          }),
        ];

        const employeeMap = listToMap(employeeIds);

        const taskIds = [
          ...result[1].data.tasks.map((element) => {
            return { value: element._id, displayValue: element.name };
          }),
        ];

        const taskMap = listToMap(taskIds);

        const sprintIds = [
          ...result[2].data.sprints.map((element) => {
            return { value: element._id, displayValue: element.name };
          }),
        ];

        const sprintMap = listToMap(sprintIds);

        this.props.setMapIdName(
          new Map([...employeeMap, ...taskMap, ...sprintMap]),
        );

        newState.form.employeeId.elementConfig.options = [
          ...newState.form.employeeId.elementConfig.options,
          ...employeeIds,
        ];

        newState.form.taskId.elementConfig.options = [
          ...newState.form.taskId.elementConfig.options,
          ...taskIds,
        ];

        newState.form.sprintId.elementConfig.options = [
          ...newState.form.sprintId.elementConfig.options,
          ...sprintIds,
        ];

        newState.formModal.employeeId.elementConfig.options = [
          ...newState.formModal.employeeId.elementConfig.options,
          ...employeeIds,
        ];

        newState.formModal.taskId.elementConfig.options = [
          ...newState.formModal.taskId.elementConfig.options,
          ...taskIds,
        ];

        newState.formModal.sprintId.elementConfig.options = [
          ...newState.formModal.sprintId.elementConfig.options,
          ...sprintIds,
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
      modalTitle = 'Add imputation';
      modalButtonText = 'Create imputation';
      creating = true;
      callback = this.createImputation;
    } else {
      modalTitle = 'Edit imputation';
      modalButtonText = 'Edit imputation';
      creating = false;
      callback = this.updateImputation;
    }
    this.setState({
      show: true,
      modalTitle,
      modalButtonText,
      creating,
      callback,
    });
  };

  openImputation = (event) => {
    this.handleShow(event);
    this.props
      .fetchImputationById(event.target.closest('tr').id)
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

  deleteImputation = () => {
    this.props
      .deleteImputation(this.props.imputation._id)
      .then(() => this.handleClose());
  };

  createImputation = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.createImputation,
      false,
    );
  };

  updateImputation = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.updateImputation,
      this.props.imputation._id,
    );
  };

  render() {
    let imputationContainer = (
      <div>
        <Navbar />
        <div className="title mt-4">
          <h1>Imputations</h1>
        </div>
        <Filters
          form={this.state.form}
          callback={this.props.fetchImputations}
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
        <Button className="btn float-right addButton" onClick={this.handleShow}>
          Add new Imputation
        </Button>
        <Table
          headers={['Employee', 'Task', 'Sprint', 'Date', 'Hours']}
          keys={['employeeId', 'taskId', 'sprintId', 'date', 'hours']}
          body={this.props.imputations}
          loading={this.props.spinner}
          error={this.props.error}
          controlError={this.props.idsFetched}
          idsNameMap={this.props.mapIdsNames}
          open={this.openImputation}
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
          fetching={this.props.fetchingImputation}
          deleteFunction={this.deleteImputation}
        ></Modal>
      </div>
    );

    if (this.props.loading) {
      imputationContainer = (
        <div>
          <Loader />
        </div>
      );
    }
    return imputationContainer;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.imputation.fetching,
    spinner: state.imputation.spinner,
    idsFetched: state.imputation.idsFetched,
    imputations: state.imputation.imputations,
    mapIdsNames: state.imputation.mapIdNameImputation,
    imputation: state.imputation.imputation,
    error: state.imputation.error,
    fetchingImputation: state.imputation.fetchingImputation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchIds: () => dispatch(actions.fetchFormImputationIds()),
    fetchImputations: (filter) => dispatch(actions.fetchImputations(filter)),
    createImputation: (imputation) =>
      dispatch(actions.createImputation(imputation)),
    fetchImputationById: (id) => dispatch(actions.fetchImputationById(id)),
    deleteImputation: (id) => dispatch(actions.deleteImputation(id)),
    setMapIdName: (map) => dispatch(actions.setMapIdsNamesImputation(map)),
    updateImputation: (imputation, id) =>
      dispatch(actions.updateImputation(imputation, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Imputation);
