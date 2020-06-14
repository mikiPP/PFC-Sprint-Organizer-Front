import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/index';
import Assigment from '../../components/Assigment/assigment';
import Loader from '../../components/Loader/loader';

class AssigmentProject extends Component {
  state = {
    keys: ['Employee'],
    options: [[]],
    values: [[]],
    valuesToSend: [[]],
    valuesToRemove: [[]],
  };

  componentDidMount() {
    this.props.fetchOptions().then((response) => {
      const options = this.state.options;
      options[0] = response.data.employees;
      const values = this.state.values;

      options[0].forEach((element) => {
        if (element.projects.includes(this.props.match.params.id)) {
          values[0].push(element);
          options[0] = options[0].filter((filter) => element !== filter);
        }
      });

      this.setState({ options, values });
    });
  }

  updateOptionsAndValues = (elementId, componentId, key) => {
    let valuesToSend, valuesToRemove, object;

    if (componentId === key) {
      valuesToRemove = this.state.valuesToRemove;
      if (valuesToRemove[0].length > 0) {
        valuesToRemove[0] = this.state.valuesToRemove[0].filter((element) => {
          if (element._id !== elementId) {
            return true;
          } else {
            object = element;
            return false;
          }
        });
      } else {
        object = this.state.options[0].filter(
          (element) => element._id === elementId,
        )[0];
      }
      valuesToSend = this.state.valuesToSend;
      valuesToSend[0].push(object);
    } else {
      valuesToSend = this.state.valuesToSend;
      if (valuesToSend[0].length > 0) {
        valuesToSend[0] = this.state.valuesToSend[0].filter((element) => {
          if (element._id !== elementId) {
            return true;
          } else {
            object = element;
            return false;
          }
        });
      } else {
        object = this.state.values[0].filter(
          (element) => element._id === elementId,
        )[0];
      }
      valuesToRemove = this.state.valuesToRemove;
      valuesToRemove[0].push(object);
    }

    this.setState({ valuesToSend, valuesToRemove });
  };

  save = () => {
    this.props.updateAssigment(
      this.state.keys,
      this.state.valuesToSend,
      this.state.valuesToRemove,
      this.props.match.params.id,
    );
  };

  render() {
    let assigment = (
      <Assigment
        keys={this.state.keys}
        object={this.props.project}
        objectName="project"
        options={this.state.options}
        values={this.state.values}
        save={this.save}
        updateOptionsAndValues={this.updateOptionsAndValues}
      />
    );

    if (this.props.loading) {
      assigment = <Loader />;
    }

    if (this.props.error) {
      assigment = (
        <div className="invalid">
          <h1>Something went wrong....</h1>
          <p>{this.props.error}</p>
          <button
            className="btn btn-danger"
            onClick={(event) => sessionStorage.clear()}
          >
            Click here to logOut
          </button>
        </div>
      );
    }

    return assigment;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.project.loading,
    project: state.project.project,
    error: state.project.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchOptions: () => dispatch(actions.fetchOptions()),
    updateAssigment: (keys, valuesToSend, valuesToRemove, projectId) =>
      dispatch(
        actions.updateAssigment(keys, valuesToSend, valuesToRemove, projectId),
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AssigmentProject);
