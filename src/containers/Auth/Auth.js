import React, { Component } from 'react';
import { connect } from 'react-redux';
import logoLetters from '../../assets/logoLetters.svg';
import { Container } from 'react-bootstrap';
import classes from './auth.module.css';
import Loader from '../../components/Loader/loader';
import * as actions from '../../store/index';
import { Link, Redirect } from 'react-router-dom';
import { checkValidity } from '../../Utils/componentUtils';

class Auth extends Component {
  state = {
    loginForm: {
      email: {
        name: 'email',
        value: '',
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        name: 'password',
        value: '',
        validation: {
          required: true,
          isPassword: true,
        },
        valid: false,
        touched: false,
      },
    },
    signUpForm: {
      name: {
        name: 'name',
        value: '',
        validation: {
          required: true,
          isEmail: false,
        },
        valid: false,
        touched: false,
      },
      surnames: {
        name: 'surnames',
        value: '',
        validation: {
          required: true,
          isEmail: false,
        },
        valid: false,
        touched: false,
      },
      profile: {
        name: 'profile',
        value: '',
        validation: {
          required: true,
          isEmail: false,
        },
        valid: false,
        touched: false,
      },
      email: {
        name: 'email',
        value: '',
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        name: 'password',
        value: '',
        validation: {
          required: true,
          isPassword: true,
        },
        valid: false,
        touched: false,
      },
      passwordConfirm: {
        name: 'passwordConfirm',
        value: '',
        validation: {
          required: true,
          isPassword: true,
          isPasswordConfirm: true,
        },
        valid: false,
        touched: false,
      },
    },
    loginFormIsValid: false,
    signUpFormIsValid: false,
    logged: false,
    submited: false,
  };

  inputChangedHandler = (event, inputIdentifier, login) => {
    const updatedForm = login
      ? { ...this.state.loginForm }
      : { ...this.state.signUpForm };
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

    let formIsValid = true;

    for (let inputIdentifier in updatedForm) {
      formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
    }

    if (login) {
      this.setState({
        loginForm: updatedForm,
        loginFormIsValid: formIsValid,
      });
    } else {
      this.setState({
        signUpForm: updatedForm,
        signUpFormIsValid: formIsValid,
      });
    }
  };

  toogleForm = () => {
    const container = document.querySelector(`.${classes.divContainer}`);
    container.classList.toggle(classes.active);
    this.setState({ logged: true });
  };

  loginHandler = (event) => {
    event.preventDefault();

    this.props.onLogin(
      this.state.loginForm.email.value,
      this.state.loginForm.password.value,
    );
    this.setState({ logged: true });
  };

  singUpHandler = (event) => {
    event.preventDefault();

    const formData = {};
    for (let formElementIdentifier in this.state.signUpForm) {
      formData[formElementIdentifier] = this.state.signUpForm[
        formElementIdentifier
      ].value;
    }

    this.props.onSignUp(formData);
    this.setState({ submited: true });
  };

  render() {
    let errorMessageSignUp = null;
    if (this.props.errorMessage && !this.props.loginFailed) {
      errorMessageSignUp = (
        <p className="invalid"> {this.props.errorMessage} </p>
      );
    }

    let errorMessageLogin = null;
    if (this.props.errorMessage && this.props.loginFailed) {
      errorMessageLogin = (
        <p className="invalid"> {this.props.errorMessage} </p>
      );
    }

    let redirectSignUp = null;
    if (
      this.state.signUpFormIsValid &&
      !this.props.errorMessage &&
      !this.props.loading &&
      this.state.submited
    ) {
      redirectSignUp = <Redirect to={{ pathname: '/auth', hash: '#active' }} />;
    }

    let form = (
      <Container className={classes.container}>
        {redirectSignUp}
        <div
          className={[
            classes.divContainer,
            this.props.location.hash ? classes.active : '',
          ].join(' ')}
        >
          <div className={[classes.user, classes.logInBx].join(' ')}>
            <div className={classes.loginImgBx}>
              <Link to="/">
                <img alt="logo" src={logoLetters}></img>
              </Link>
            </div>
            <div className={classes.formBx}>
              <form onSubmit={this.loginHandler}>
                {errorMessageLogin}
                <h1>Login</h1>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={(event) =>
                    this.inputChangedHandler(
                      event,
                      this.state.loginForm.email.name,
                      true,
                    )
                  }
                ></input>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={(event) =>
                    this.inputChangedHandler(
                      event,
                      this.state.loginForm.password.name,
                      true,
                    )
                  }
                ></input>
                <input
                  disabled={!this.state.loginFormIsValid}
                  type="submit"
                  name="submit"
                  value="Login"
                ></input>
                <p className={classes.authMessage}>
                  Do not have an account ?
                  <span onClick={this.toogleForm}> Sign up.</span>
                </p>
              </form>
            </div>
          </div>
          <div className={[classes.user, classes.signUpBx].join(' ')}>
            <div className={classes.formBx}>
              <form onSubmit={this.singUpHandler}>
                {errorMessageSignUp}
                <h1>Sign Up</h1>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={(event) =>
                    this.inputChangedHandler(
                      event,
                      this.state.signUpForm.name.name,
                      false,
                    )
                  }
                ></input>
                <input
                  type="text"
                  name="surnames"
                  placeholder="Surnames"
                  onChange={(event) =>
                    this.inputChangedHandler(
                      event,
                      this.state.signUpForm.surnames.name,
                      false,
                    )
                  }
                ></input>
                <input
                  type="text"
                  name="profile"
                  placeholder="Profile"
                  onChange={(event) =>
                    this.inputChangedHandler(
                      event,
                      this.state.signUpForm.profile.name,
                      false,
                    )
                  }
                ></input>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={(event) =>
                    this.inputChangedHandler(
                      event,
                      this.state.signUpForm.email.name,
                      false,
                    )
                  }
                ></input>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={(event) =>
                    this.inputChangedHandler(
                      event,
                      this.state.signUpForm.password.name,
                      false,
                    )
                  }
                ></input>
                {!this.state.signUpForm.password.valid &&
                this.state.signUpForm.password.touched ? (
                  <small className="invalid">
                    The password must contain 8 characters, and must contain: a
                    LowerCase letter, an UpperCase letter, a simbol like: _,!
                    and a number
                  </small>
                ) : null}
                <input
                  type="password"
                  name="passwordConfirm"
                  placeholder="Confirm Password"
                  onChange={(event) =>
                    this.inputChangedHandler(
                      event,
                      this.state.signUpForm.passwordConfirm.name,
                      false,
                    )
                  }
                ></input>
                {!this.state.signUpForm.password.valid &&
                this.state.signUpForm.password.touched ? (
                  <small className="invalid">The passwords must match</small>
                ) : null}
                <input
                  disabled={!this.state.signUpFormIsValid}
                  type="submit"
                  name="submit"
                  value="Sign Up"
                ></input>
                <p className={classes.authMessage}>
                  Already have an account ?
                  <span onClick={this.toogleForm}> Login.</span>
                </p>
              </form>
            </div>
            <div className={classes.imgBx}>
              <Link to="/">
                <img alt="logo" src={logoLetters}></img>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );

    if (this.props.loading) {
      form = <Loader />;
    }

    if (sessionStorage.getItem('logged') && this.state.logged) {
      form = <Redirect to="/project"></Redirect>;
    }

    return <div> {form} </div>;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    errorMessage: state.auth.error,
    loginFailed: state.auth.loginFailed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (email, password) => dispatch(actions.auth(email, password)),
    onSignUp: (userData) => dispatch(actions.signUp(userData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
