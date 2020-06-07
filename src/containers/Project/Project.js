import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/index';
import Navbar from '../../components/Navbar/navbar';
import Filters from '../../components/Filters/filters';
import { cleanObject, listToMap } from '../../Utils/objectUtils';
import Table from '../../components/Table/table';
import classes from './project.module.css';
import Loader from '../../components/Loader/loader';

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
    formIsValid: true,
    projects: null,
    idsNameMap: null,
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

        this.setState(newState);
      })
      .catch((err) => console.log(err));
    // this will be handled by redux
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedForm = { ...this.state.form };
    const updatedFormElement = {
      ...updatedForm[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation,
    );
    updatedFormElement.touched = true;
    updatedForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;

    for (let inputIdentifier in updatedForm) {
      formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({
      form: updatedForm,
      formIsValid: formIsValid,
    });
  };

  checkValidity(value, rules) {
    let isValid = true;

    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isPassword) {
      const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isPasswordConfirm) {
      isValid = value === this.state.signUpForm.password.value && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  }

  projectFilterHandler = (event) => {
    event.preventDefault();

    const filter = {};

    for (let formElementIdentifier in this.state.form) {
      if (this.state.form[formElementIdentifier].value !== '') {
        filter[formElementIdentifier] = this.state.form[
          formElementIdentifier
        ].value;
      }
    }

    cleanObject(filter);

    this.props.fetchProjects(filter);
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
          inputChangedHandler={this.inputChangedHandler}
          checkValidity={this.checkValidity}
          formValid={this.state.formIsValid}
          onSubmit={this.projectFilterHandler}
          error={this.props.error}
          controlError={this.props.idsFetched}
        />
        <Table
          headers={['Name', 'Scrum Master', 'Product Owner']}
          keys={['name', 'scrumMaster', 'productOwner']}
          body={this.props.projects}
          loading={this.props.spinner}
          error={this.props.error}
          controlError={this.props.idsFetched}
          idsNameMap={this.state.idsNameMap}
        />
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);
