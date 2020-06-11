import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import * as actions from '../../store/index';
import Navbar from '../../components/Navbar/navbar';
import Filters from '../../components/Filters/filters';
import {
  checkValidity,
  inputChangedHandler,
  filterHandler,
} from '../../Utils/componentUtils';
import Table from '../../components/Table/table';
import Loader from '../../components/Loader/loader';
import Modal from '../../components/Modal/modal';
import classes from './role.module.css';

class Role extends Component {
  state = {
    form: {
      name: {
        elementConfig: {
          elementType: 'input',
          type: 'text',
          placeholder: 'Filter Role by Name',
          label: 'Name',
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      disabled: {
        elementConfig: {
          elementType: 'input',
          type: 'checkbox',
          placeholder: 'Filter Role by disabled',
          label: 'Disabled',
        },
        value: false,
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
      disabled: {
        elementConfig: {
          elementType: 'input',
          type: 'checkbox',
          label: 'Disabled',
        },
        value: undefined,
        valid: true,
        touched: false,
      },
    },
    formIsValid: true,
    formModalIsValid: false,
    roles: null,
    idsNameMap: null,
    show: false,
    modalTitle: null,
    creating: null,
    modalButtonText: '',
    callback: null,
  };

  /** First request get all the employes with role Scrum master and the second one
   * gets the employes with product owner role.
   */

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
      modalTitle = 'Add role';
      modalButtonText = 'Create role';
      creating = true;
      callback = this.createRole;
    } else {
      modalTitle = 'Edit role';
      modalButtonText = 'Edit role';
      creating = false;
      callback = this.updateRole;
    }
    this.setState({
      show: true,
      modalTitle,
      modalButtonText,
      creating,
      callback,
    });
  };

  openRole = (event) => {
    this.handleShow(event);
    this.props
      .fetchRoleById(event.target.closest('tr').id)
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

  deleteRole = () => {
    this.props.deleteRole(this.props.role._id).then(() => this.handleClose());
  };

  createRole = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.createRole,
      false,
    );
  };

  updateRole = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.updateRole,
      this.props.role._id,
    );
  };

  render() {
    let roleContainer = (
      <div>
        <Navbar />
        <div className="title mt-4">
          <h1>Role</h1>
        </div>
        <div className={classes.roleFilterContainer}>
          <Filters
            form={this.state.form}
            callback={this.props.fetchRoles}
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
        </div>
        <Button
          className="btn btn-succeses float-right addButton"
          onClick={this.handleShow}
        >
          Add new Role
        </Button>
        <Table
          headers={['Name', 'Description']}
          keys={['name', 'description']}
          body={this.props.roles}
          loading={this.props.spinner}
          error={this.props.error}
          controlError={this.props.idsFetched}
          idsNameMap={this.state.idsNameMap}
          open={this.openRole}
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
          fetching={this.props.fetchingRole}
          deleteFunction={this.deleteRole}
        ></Modal>
      </div>
    );

    if (this.props.loading) {
      roleContainer = (
        <div>
          <Loader />
        </div>
      );
    }
    return roleContainer;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.role.fetching,
    spinner: state.role.spinner,
    idsFetched: state.role.idsFetched,
    roles: state.role.roles,
    role: state.role.role,
    error: state.role.error,
    fetchingRole: state.role.fetchingRole,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRoles: (filter) => dispatch(actions.fetchRoles(filter)),
    createRole: (role) => dispatch(actions.createRole(role)),
    fetchRoleById: (id) => dispatch(actions.fetchRoleById(id)),
    deleteRole: (id) => dispatch(actions.deleteRole(id)),
    updateRole: (role, id) => dispatch(actions.updateRole(role, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Role);
