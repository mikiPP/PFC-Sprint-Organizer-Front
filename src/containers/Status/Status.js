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
import classes from './status.module.css';

class Status extends Component {
  state = {
    form: {
      name: {
        elementConfig: {
          elementType: 'input',
          type: 'text',
          placeholder: 'Filter Status by Name',
          label: 'Name',
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
    },
    formIsValid: true,
    formModalIsValid: false,
    statuses: null,
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
      modalTitle = 'Add status';
      modalButtonText = 'Create status';
      creating = true;
      callback = this.createStatus;
    } else {
      modalTitle = 'Edit status';
      modalButtonText = 'Edit status';
      creating = false;
      callback = this.updateStatus;
    }
    this.setState({
      show: true,
      modalTitle,
      modalButtonText,
      creating,
      callback,
    });
  };

  openStatus = (event) => {
    this.handleShow(event);
    this.props
      .fetchStatusById(event.target.closest('tr').id)
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

  deleteStatus = () => {
    this.props
      .deleteStatus(this.props.status._id)
      .then(() => this.handleClose());
  };

  createStatus = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.createStatus,
      false,
    );
  };

  updateStatus = (event) => {
    return filterHandler(
      event,
      this.state.formModal,
      this.props.updateStatus,
      this.props.status._id,
    );
  };

  render() {
    let statusContainer = (
      <div>
        <Navbar />
        <div className="title mt-4">
          <h1>Status</h1>
        </div>
        <Filters
          form={this.state.form}
          callback={this.props.fetchStatuses}
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
          Add new Status
        </Button>
        <Table
          headers={['Name', 'Description']}
          keys={['name', 'description']}
          body={this.props.statuses}
          loading={this.props.spinner}
          error={this.props.error}
          controlError={this.props.idsFetched}
          idsNameMap={this.state.idsNameMap}
          open={this.openStatus}
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
          fetching={this.props.fetchingStatus}
          deleteFunction={this.deleteStatus}
        ></Modal>
      </div>
    );

    if (this.props.loading) {
      statusContainer = (
        <div>
          <Loader />
        </div>
      );
    }
    return statusContainer;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.status.fetching,
    spinner: state.status.spinner,
    idsFetched: state.status.idsFetched,
    statuses: state.status.statuses,
    status: state.status.status,
    error: state.status.error,
    fetchingStatus: state.status.fetchingStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchStatuses: (filter) => dispatch(actions.fetchStatuses(filter)),
    createStatus: (status) => dispatch(actions.createStatus(status)),
    fetchStatusById: (id) => dispatch(actions.fetchStatusById(id)),
    deleteStatus: (id) => dispatch(actions.deleteStatus(id)),
    updateStatus: (status, id) => dispatch(actions.updateStatus(status, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Status);
