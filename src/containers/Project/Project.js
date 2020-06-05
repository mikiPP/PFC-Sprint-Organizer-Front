import React, { Component } from 'react';
import axios from 'axios';

import Navbar from '../../components/Navbar/navbar';
import Filters from '../../components/Filters/filters';
import { cleanObject } from '../../store/utility';
import Table from '../../components/Table/table';

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
          options: [{ value: '0', displayValue: 'Product Owner' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
      scrumMaster: {
        elementConfig: {
          elementType: 'select',
          label: 'Filter by ScrumMaster',
          options: [{ value: '0', displayValue: 'Scrum Master' }],
        },
        value: undefined,
        valid: true,
        touched: false,
      },
    },
    formIsValid: true,
    projects: null,
  };

  /** First request get all the employees with role Scrum master and the second one
   * gets the employees with product owner role.
   */

  componentDidMount() {
    Promise.all([
      axios.post('/employee/filter', { roleId: '5eda8a75d9fd3e0004253c7d' }),
      axios.post('/employee/filter', { roleId: '5eda8a88d9fd3e0004253c7e' }),
    ]).then((result) => {
      const scrumMasterIds = [
        ...result[0].data.employees.map((element) => {
          return { value: element._id, displayValue: element.name };
        }),
      ];
      const productOwnerIds = [
        ...result[1].data.employees.map((element) => {
          return { value: element._id, displayValue: element.name };
        }),
      ];

      const newState = Object.assign(this.state, {});
      newState.form.productOwner.elementConfig.options = [
        ...newState.form.productOwner.elementConfig.options,
        ...productOwnerIds,
      ];
      newState.form.scrumMaster.elementConfig.options = [
        ...newState.form.scrumMaster.elementConfig.options,
        ...scrumMasterIds,
      ];

      this.setState(newState);
    });
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
      filter[formElementIdentifier] = this.state.form[
        formElementIdentifier
      ].value;
    }

    cleanObject(filter);

    axios
      .post('project/filter', filter)
      .then((result) => this.setState({ projects: result.data.projects }));
  };

  render() {
    return (
      <div>
        <Navbar />

        <Filters
          form={this.state.form}
          inputChangedHandler={this.inputChangedHandler}
          checkValidity={this.checkValidity}
          formValid={this.state.formIsValid}
          onSubmit={this.projectFilterHandler}
        ></Filters>
        <Table
          headers={['Name', 'Scrum Master', 'Product Owner']}
          keys={['name', 'scrumMaster', 'productOwner']}
          body={this.state.projects}
        ></Table>
      </div>
    );
  }
}

export default Project;
