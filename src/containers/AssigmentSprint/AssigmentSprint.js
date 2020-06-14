import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/index';
import Assigment from '../../components/Assigment/assigment';
import Loader from '../../components/Loader/loader';

class AssigmentSprint extends Component {
  state = {
    keys: ['employee', 'task'],
    options: [[], []],
    values: [[], []],
    valuesToSend: [[], []],
    valuesToRemove: [[], []],
    sprint: null,
  };

  componentDidMount() {
    this.props
      .fetchOptions(this.props.match.params.id)
      .then((response) => {
        const options = this.state.options;
        options[0] = response[0].data.employees;
        options[1] = response[1].data.tasks;
        const values = this.state.values;

        const sprint = response[2].data.sprint;

        options[0] = options[0].filter((option, index) => {
          if (sprint.employees.includes(option._id)) {
            values[0].push(option);
            return false;
          }
          return true;
        });

        options[1] = options[1].filter((option, index) => {
          if (sprint.tasks.includes(option._id)) {
            values[1].push(option);
            return false;
          }
          return true;
        });

        this.setState({ options, values, sprint });
      })
      .catch((err) => console.error(err));
  }

  updateOptionsAndValues = (elementId, componentId, key) => {
    let valuesToSend, valuesToRemove, object;
    if (componentId === key) {
      let arrayIndex;
      if (
        this.state.valuesToRemove[0].length > 0 ||
        this.state.valuesToRemove[1].length > 0
      ) {
        this.state.valuesToRemove.forEach((element, index) =>
          element.filter((innerElement) => {
            if (innerElement._id === elementId) {
              arrayIndex = index;
              object = innerElement;
              return false;
            }
            return true;
          }),
        );
      }
      if (!object) {
        valuesToRemove = this.state.valuesToRemove;
        this.state.options.map((element, index) =>
          element.filter((innerElement) => {
            if (innerElement._id === elementId) {
              arrayIndex = index;
              object = innerElement;
              return true;
            }
            return false;
          }),
        );
      }
      if (object) {
        valuesToSend = this.state.valuesToSend;
        valuesToSend[arrayIndex].push(object);
      }
    } else {
      let arrayIndex;

      if (
        this.state.valuesToSend[0].length > 0 ||
        this.state.valuesToSend[1].length > 0
      ) {
        valuesToSend = this.state.valuesToSend;
        this.state.valuesToSend.forEach((element, index) => {
          valuesToSend[index] = element.filter((innerElement) => {
            if (innerElement._id === elementId) {
              arrayIndex = index;
              object = innerElement;
              return false;
            }
            return true;
          });
        });
      }
      if (!object) {
        this.state.values.map((element, index) =>
          element.filter((innerElement) => {
            if (innerElement._id === elementId) {
              arrayIndex = index;
              object = innerElement;
              return true;
            }

            return false;
          }),
        );
      }
      if (object) {
        valuesToRemove = this.state.valuesToRemove;
        valuesToRemove[arrayIndex].push(object);
      }
    }
    if (valuesToSend && valuesToRemove) {
      this.setState({ valuesToSend, valuesToRemove });
    }
  };

  save = () => {
    this.props.updateAssigment(
      this.state.keys,
      this.state.valuesToSend,
      this.state.valuesToRemove,
      this.state.sprint,
    );
  };

  render() {
    let assigment = (
      <Assigment
        keys={this.state.keys}
        object={this.props.sprint}
        objectName="sprint"
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
    loading: state.sprint.loading,
    sprint: state.sprint.sprint,
    error: state.sprint.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchOptions: (id) => dispatch(actions.fetchOptionsSprint(id)),
    updateAssigment: (keys, valuesToSend, valuesToRemove, sprint) =>
      dispatch(
        actions.updateAssigmentSprint(
          keys,
          valuesToSend,
          valuesToRemove,
          sprint,
        ),
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AssigmentSprint);
