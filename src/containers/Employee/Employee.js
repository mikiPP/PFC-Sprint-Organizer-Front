import React, { Component } from 'react';
import { connect } from 'react-redux';

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

class Employee extends Component {
  state = {
    form: {
      name: {
        elementConfig: {
          elementType: 'input',
          type: 'text',
          placeholder: 'Filter Employee by Name',
          label: 'Name',
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      surnames: {
        elementConfig: {
          elementType: 'input',
          type: 'text',
          placeholder: 'Filter Employee by surnames',
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
      companyId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Company',
          options: [{ value: '', displayValue: 'Company' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      roleId: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by Role',
          options: [{ value: '', displayValue: 'Role' }],
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
      surnames: {
        elementConfig: {
          elementType: 'input',
          type: 'text',
          placeholder: ' Surnames',
          label: 'Surname',
        },
        validation: {
          required: true,
        },
        value: '',
        valid: false,
        touched: false,
      },
      email: {
        elementConfig: {
          elementType: 'input',
          type: 'email',
          placeholder: 'Email',
          label: 'Email',
        },
        validation: {
          required: true,
          isEmail: true,
        },
        value: '',
        valid: false,
        touched: false,
      },
      profile: {
        elementConfig: {
          elementType: 'input',
          type: 'text',
          placeholder: 'Profile',
          label: 'Profile',
        },
        validation: {
          required: true,
        },
        value: '',
        valid: false,
        touched: false,
      },
      roleId: {
        elementConfig: {
          elementType: 'select',
          label: 'Role',
          options: [{ value: '', displayValue: 'Role' }],
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
          options: [{ value: '', displayValue: 'Company' }],
        },
        validation: {
          required: true,
        },
        value: undefined,
        valid: false,
        touched: false,
      },
    },

    formIsValid: true,
    formModalIsValid: false,
    employees: null,
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
      .fetchFormEmployeeIds()
      .then((result) => {
        const newState = Object.assign(this.state, {});

        const company = result[0].data.company;
        const companyId = [{ value: company._id, displayValue: company.name }];

        const companyMap = listToMap(companyId);

        const projectIds = [
          ...result[1].data.projects.map((element) => {
            return { value: element._id, displayValue: element.name };
          }),
        ];

        const projectMap = listToMap(projectIds);

        const roleIds = [
          ...result[2].data.roles.map((element) => {
            return { value: element._id, displayValue: element.name };
          }),
        ];

        const roleMap = listToMap(roleIds);

        newState.idsNameMap = new Map([
          ...companyMap,
          ...roleMap,
          ...projectMap,
        ]);

        newState.form.companyId.elementConfig.options = [
          ...newState.form.companyId.elementConfig.options,
          ...companyId,
        ];

        newState.form.projectId.elementConfig.options = [
          ...newState.form.projectId.elementConfig.options,
          ...projectIds,
        ];

        newState.form.roleId.elementConfig.options = [
          ...newState.form.roleId.elementConfig.options,
          ...roleIds,
        ];

        newState.formModal.companyId.elementConfig.options = [
          ...newState.formModal.companyId.elementConfig.options,
          ...companyId,
        ];

        newState.formModal.roleId.elementConfig.options = [
          ...newState.formModal.roleId.elementConfig.options,
          ...roleIds,
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
      modalTitle = 'Add employee';
      modalButtonText = 'Create employee';
      creating = true;
      callback = this.createEmployee;
    } else {
      modalTitle = 'Edit employee';
      modalButtonText = 'Edit employee';
      creating = false;
      callback = this.updateEmployee;
    }
    this.setState({
      show: true,
      modalTitle,
      modalButtonText,
      creating,
      callback,
    });
  };

  openEmployee = (event) => {
    this.handleShow(event);
    this.props
      .fetchEmployeeById(event.target.closest('tr').id)
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

  deleteEmployee = () => {
    this.props
      .deleteEmployee(this.props.employee._id)
      .then(() => this.handleClose());
  };

  createEmployee = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.createEmployee,
      false,
    );
  };

  updateEmployee = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.updateEmployee,
      this.props.employee._id,
    );
  };

  render() {
    let employeeContainer = (
      <div>
        <Navbar />
        <div className="title mt-4">
          <h1>Employee</h1>
        </div>
        <Filters
          form={this.state.form}
          callback={this.props.fetchEmployees}
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

        <Table
          headers={['Name', 'Surnames', 'Profile', 'Role']}
          keys={['name', 'surnames', 'profile', 'roleId']}
          body={this.props.employees}
          loading={this.props.spinner}
          error={this.props.error}
          controlError={this.props.idsFetched}
          idsNameMap={this.state.idsNameMap}
          open={this.openEmployee}
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
          fetching={this.props.fetchingEmployee}
          deleteFunction={this.deleteEmployee}
        ></Modal>
      </div>
    );

    if (this.props.loading) {
      employeeContainer = (
        <div>
          <Loader />
        </div>
      );
    }
    return employeeContainer;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.employee.fetching,
    spinner: state.employee.spinner,
    idsFetched: state.employee.idsFetched,
    employees: state.employee.employees,
    employee: state.employee.employee,
    error: state.employee.error,
    fetchingEmployee: state.employee.fetchingEmployee,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFormEmployeeIds: () => dispatch(actions.fetchFormEmployeeIds()),
    fetchEmployees: (filter) => dispatch(actions.fetchEmployees(filter)),
    createEmployee: (employee) => dispatch(actions.createEmployee(employee)),
    fetchEmployeeById: (id) => dispatch(actions.fetchEmployeeById(id)),
    deleteEmployee: (id) => dispatch(actions.deleteEmployee(id)),
    updateEmployee: (employee, id) =>
      dispatch(actions.updateEmployee(employee, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Employee);
