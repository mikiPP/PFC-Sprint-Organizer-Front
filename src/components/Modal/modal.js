import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button, Spinner } from 'react-bootstrap';

import Filters from '../Filters/filters';
import classes from './modal.module.css';

const modal = (props) => {
  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header className={classes.title} closeButton>
        <Modal.Title>
          <i className="fas fa-edit"></i> {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.loading || props.fetching ? (
          <Spinner
            className="mt-4"
            animation="border"
            role="status"
            variant="primary"
          />
        ) : (
          <Filters
            form={props.form}
            formName={props.formName}
            formIsValidName={props.formIsValidName}
            inputChangedHandler={props.inputChangedHandler}
            checkValidity={props.checkValidity}
            formValid={props.formIsValid}
            onSubmit={props.projectFilterHandler}
            formClass="displayFlex"
            submitButton={false}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        {!props.creating ? (
          <Button variant="danger" onClick={props.deleteFunction}>
            <i className="fas fa-trash"></i> Delete
          </Button>
        ) : null}
        <Button
          className={classes.Button}
          onClick={(event) => {
            return props.callback(event);
          }}
          disabled={!props.formValid}
        >
          {props.buttonText.includes('Create') ? (
            <i className="fas fa-plus"></i>
          ) : (
            <i className="fas fa-pencil-alt"></i>
          )}
          {props.buttonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default modal;
