import { cleanObject } from './objectUtils';

export const checkValidity = function (value, rules) {
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
};

export const inputChangedHandler = (event, inputIdentifier, form) => {
  const updatedForm = { ...form };
  const updatedFormElement = {
    ...updatedForm[inputIdentifier],
  };

  updatedFormElement.value = event.target.value;
  updatedFormElement.valid = checkValidity(
    updatedFormElement.value,
    updatedFormElement.validation,
  );

  updatedFormElement.touched = true;
  updatedForm[inputIdentifier] = updatedFormElement;

  if (event.target.type === 'checkbox') {
    updatedForm[inputIdentifier].value = event.target.checked;
  }

  let formIsValid = true;

  for (let inputIdentifier in updatedForm) {
    formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
  }

  return {
    form: updatedForm,
    formIsValid: formIsValid,
  };
};

export const filterHandler = (event, form, callback, id) => {
  event.preventDefault();

  const filter = {};

  for (let formElementIdentifier in form) {
    if (form[formElementIdentifier].elementConfig.type === 'checkbox') {
      filter[formElementIdentifier] = true;
    }
    if (form[formElementIdentifier].value !== '') {
      filter[formElementIdentifier] = form[formElementIdentifier].value;
    }
  }

  cleanObject(filter);

  if (id) {
    return callback(filter, id);
  }
  return callback(filter);
};
