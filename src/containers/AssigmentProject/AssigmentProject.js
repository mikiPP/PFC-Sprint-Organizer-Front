import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/index';
import Assigment from '../../components/Assigment/assigment';

class AssigmentProject extends Component {
  state = {
    object: null,
    keys: ['Employee', 'Patata'],
  };

  render() {
    return (
      <Assigment
        keys={this.state.keys}
        object={this.props.project}
        objectName="project"
        id={this.props.match.params.id}
        options={[
          [{ title: 'test', description: 'this is a description', _id: 1 }],
          [{ title: 'test2', description: 'this is a description2', _id: 2 }],
        ]}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.project.fetching,
    spinner: state.project.spinner,
    project: state.project.project,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAssigmentIds: () => dispatch(actions.fetchIds()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AssigmentProject);
