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

class Permission extends Component {
  state = {
    form: {
      name: {
        elementConfig: {
          elementType: 'input',
          type: 'text',
          placeholder: 'Filter Permission by Name',
          label: 'Name',
        },
        value: '',
        valid: true,
        touched: false,
      },
      disabled: {
        elementConfig: {
          elementType: 'input',
          type: 'checkbox',
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
    permissions: null,
    idsNameMap: null,
    show: false,
    modalTitle: null,
    creating: null,
    modalButtonText: '',
    callback: null,
  };

  /** First request get all the employes with permission Scrum master and the second one
   * gets the employes with product owner permission.
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
      modalTitle = 'Add permission';
      modalButtonText = 'Create permission';
      creating = true;
      callback = this.createPermission;
    } else {
      modalTitle = 'Edit permission';
      modalButtonText = 'Edit permission';
      creating = false;
      callback = this.updatePermission;
    }
    this.setState({
      show: true,
      modalTitle,
      modalButtonText,
      creating,
      callback,
    });
  };

  openPermission = (event) => {
    this.handleShow(event);
    this.props
      .fetchPermissionById(event.target.closest('tr').id)
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

  deletePermission = () => {
    this.props
      .deletePermission(this.props.permission._id)
      .then(() => this.handleClose());
  };

  createPermission = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.createPermission,
      false,
    );
  };

  updatePermission = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.updatePermission,
      this.props.permission._id,
    );
  };

  render() {
    let permissionContainer = (
      <div>
        <Navbar />
        <div className="title mt-4">
          <h1>Permission</h1>
        </div>
        <Filters
          form={this.state.form}
          callback={this.props.fetchPermissions}
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
          className="btn btn-succeses float-right addButton"
          onClick={this.handleShow}
        >
          Add new Permission
        </Button>
        <Table
          headers={['Name', 'Description']}
          keys={['name', 'description']}
          body={this.props.permissions}
          loading={this.props.spinner}
          error={this.props.error}
          controlError={this.props.idsFetched}
          idsNameMap={this.state.idsNameMap}
          open={this.openPermission}
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
          fetching={this.props.fetchingPermission}
          deleteFunction={this.deletePermission}
        ></Modal>
      </div>
    );

    if (this.props.loading) {
      permissionContainer = (
        <div>
          <Loader />
        </div>
      );
    }
    return permissionContainer;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.permission.fetching,
    spinner: state.permission.spinner,
    idsFetched: state.permission.idsFetched,
    permissions: state.permission.permissions,
    permission: state.permission.permission,
    error: state.permission.error,
    fetchingPermission: state.permission.fetchingPermission,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPermissions: (filter) => dispatch(actions.fetchPermissions(filter)),
    createPermission: (permission) =>
      dispatch(actions.createPermission(permission)),
    fetchPermissionById: (id) => dispatch(actions.fetchPermissionById(id)),
    deletePermission: (id) => dispatch(actions.deletePermission(id)),
    updatePermission: (permission, id) =>
      dispatch(actions.updatePermission(permission, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Permission);
