import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button, Spinner } from 'react-bootstrap';

import Filters from '../Filters/filters';
import classes from './modal.module.css';
import { projectFilterHandler } from '../../Utils/componentUtils';

const modal = (props) => {
  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header className={classes.title} closeButton>
        <Modal.Title>
          <i className="fas fa-edit"></i> {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.loading ? (
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
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button
          variant={props.variant}
          onClick={(event) =>
            projectFilterHandler(event, props.form, props.callback)
          }
          disabled={!props.formValid}
        >
          {props.buttonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default modal;
