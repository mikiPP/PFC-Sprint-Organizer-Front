import React, { Component } from 'react';
import classes from './filters.module.css';
import Input from '../Input/input';
import Loader from '../Loader/loader';

class Filters extends Component {
  render() {
    const formElementsArray = [];
    for (let key in this.props.form) {
      formElementsArray.push({
        id: key,
        config: this.props.form[key].elementConfig,
        value: this.props.form[key].value,
        invalid: !this.props.form[key].valid,
        touched: this.props.form[key].touched,
      });
    }

    let form = formElementsArray.map((formElement) => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.options}
        type={formElement.config.type}
        value={formElement.value}
        invalid={formElement.invalid}
        shouldValidate={formElement.config.validation}
        touched={formElement.touched}
        label={formElement.config.label}
        placeholder={formElement.config.placeholder}
        changed={(event) =>
          this.props.inputChangedHandler(event, formElement.id)
        }
      />
    ));

    if (this.props.loading) {
      form = <Loader />;
    }

    let errorMessage = null;

    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>;
    }

    return (
      <div className={classes.container}>
        <form onSubmit={this.props.onSubmit}>
          <div className={classes.displayGrid}>{form}</div>
          <input
            disabled={!this.props.formValid}
            type="submit"
            name="submit"
            value="Filter"
            className="btn btn-primary"
          ></input>
        </form>
      </div>
    );
  }
}

export default Filters;
