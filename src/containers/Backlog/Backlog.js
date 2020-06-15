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
      backlog: {
        elementConfig: {
          elementType: 'input',
          type: 'checkbox',
          label: 'Filter by Backlog',
        },
        value: true,
        valid: true,
        touched: false,
      },
      creatorId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Creator',
          options: [{ value: '', displayValue: 'Creator' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      realizerId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Realizer',
          options: [{ value: '', displayValue: 'Realizer' }],
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
      //   Type: {
      //     elementConfig: {
      //       elementType: 'select',
      //       label: 'Filter by Type',
      //       options: [{ value: '', displayValue: 'Type' }],
      //     },
      //     value: undefined,
      //     valid: true,
      //     touched: false,
      //   },
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
      backlog: {
        elementConfig: {
          elementType: 'input',
          type: 'checkbox',
          checked: false,
          label: 'Filter by Backlog',
        },
        value: true,
        valid: false,
        touched: false,
      },
      creatorId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Creator',
          options: [{ value: '', displayValue: 'Creator' }],
        },
        validation: {
          required: true,
        },
        value: '',
        valid: false,
        touched: false,
      },
      realizerId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Realizer',
          options: [{ value: '', displayValue: 'Realizer' }],
        },
        validation: {
          required: true,
        },
        value: '',
        valid: false,
        touched: false,
      },
      sprintId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Sprint',
          options: [{ value: '', displayValue: 'Sprint' }],
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
      estimatedTime: {
        elementConfig: {
          elementType: 'input',
          type: 'number',
          placeholder: '0',
          label: 'Estimated time',
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
    tasks: null,
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
      .fetchFormTaskIds()
      .then((result) => {
        const newState = Object.assign(this.state, {});

        const employeesIds = [
          ...result[0].data.employees.map((element) => {
            return { value: element._id, displayValue: element.name };
          }),
        ];

        const employeesMap = listToMap(employeesIds);

        const projectIds = [
          ...result[1].data.projects.map((element) => {
            return { value: element._id, displayValue: element.name };
          }),
        ];

        const projectMap = listToMap(projectIds);

        const statusIds = [
          ...result[2].data.statuses.map((element) => {
            return { value: element._id, displayValue: element.name };
          }),
        ];

        const statusMap = listToMap(statusIds);

        const sprintIds = [
          ...result[3].data.sprints.map((element) => {
            return { value: element._id, displayValue: element.name };
          }),
        ];

        const sprintMap = listToMap(sprintIds);

        this.props.setMapIdName(
          new Map([...employeesMap, ...projectMap, ...statusMap, ...sprintMap]),
        );

        newState.form.creatorId.elementConfig.options = [
          ...newState.form.creatorId.elementConfig.options,
          ...employeesIds,
        ];

        newState.form.realizerId.elementConfig.options = [
          ...newState.form.realizerId.elementConfig.options,
          ...employeesIds,
        ];

        newState.form.projectId.elementConfig.options = [
          ...newState.form.projectId.elementConfig.options,
          ...projectIds,
        ];

        newState.form.statusId.elementConfig.options = [
          ...newState.form.statusId.elementConfig.options,
          ...statusIds,
        ];
        newState.form.sprintId.elementConfig.options = [
          ...newState.form.sprintId.elementConfig.options,
          ...sprintIds,
        ];

        newState.formModal.creatorId.elementConfig.options = [
          ...newState.formModal.creatorId.elementConfig.options,
          ...employeesIds,
        ];

        newState.formModal.realizerId.elementConfig.options = [
          ...newState.formModal.realizerId.elementConfig.options,
          ...employeesIds,
        ];

        newState.formModal.projectId.elementConfig.options = [
          ...newState.formModal.projectId.elementConfig.options,
          ...projectIds,
        ];

        newState.formModal.statusId.elementConfig.options = [
          ...newState.formModal.statusId.elementConfig.options,
          ...statusIds,
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
      modalTitle = 'Add task';
      modalButtonText = 'Create task';
      creating = true;
      callback = this.createTask;
    } else {
      modalTitle = 'Edit task';
      modalButtonText = 'Edit task';
      creating = false;
      callback = this.updateTask;
    }
    this.setState({
      show: true,
      modalTitle,
      modalButtonText,
      creating,
      callback,
    });
  };

  openTask = (event) => {
    this.handleShow(event);
    this.props
      .fetchTaskById(event.target.closest('tr').id)
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

  deleteTask = () => {
    this.props.deleteTask(this.props.task._id).then(() => this.handleClose());
  };

  createTask = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.createTask,
      false,
    );
  };

  updateTask = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.updateTask,
      this.props.task._id,
    );
  };

  render() {
    let taskContainer = (
      <div>
        <Navbar />
        <div className="title mt-4">
          <h1>Backlog</h1>
        </div>
        <Filters
          form={this.state.form}
          callback={this.props.fetchTasks}
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
          Add new Task
        </Button>
        <Table
          headers={[
            'Name',
            'Description',
            'Project',
            'Creator',
            'Realizer',
            'Status',
            'Sprint',
          ]}
          keys={[
            'name',
            'description',
            'projectId',
            'creatorId',
            'realizerId',
            'statusId',
            'sprintId',
          ]}
          body={this.props.tasks}
          loading={this.props.spinner}
          error={this.props.error}
          controlError={this.props.idsFetched}
          idsNameMap={this.props.mapIdNameTask}
          open={this.openTask}
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
          fetching={this.props.fetchingTask}
          deleteFunction={this.deleteTask}
        ></Modal>
      </div>
    );

    if (this.props.loading) {
      taskContainer = (
        <div>
          <Loader />
        </div>
      );
    }
    return taskContainer;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.task.fetching,
    spinner: state.task.spinner,
    idsFetched: state.task.idsFetched,
    tasks: state.task.tasks,
    task: state.task.task,
    mapIdNameTask: state.task.mapIdNameTask,
    error: state.task.error,
    fetchingTask: state.task.fetchingTask,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFormTaskIds: () => dispatch(actions.fetchFormTaskIds()),
    fetchTasks: (filter) => dispatch(actions.fetchTasks(filter)),
    createTask: (task) => dispatch(actions.createTask(task)),
    fetchTaskById: (id) => dispatch(actions.fetchTaskById(id)),
    deleteTask: (id) => dispatch(actions.deleteTask(id)),
    setMapIdName: (map) => dispatch(actions.setMapIdsNamesTask(map)),
    updateTask: (task, id) => dispatch(actions.updateTask(task, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Backlog);
