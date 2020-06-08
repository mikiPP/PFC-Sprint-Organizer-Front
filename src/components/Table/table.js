import React from 'react';
import { Table } from 'react-bootstrap';
import classes from './table.module.css';
import TableRow from '../TableRow/tableRow';
import { Spinner } from 'react-bootstrap';

const table = (props) => {
  const headers = props.body
    ? props.headers.map((element) => <th key={element}>{element}</th>)
    : null;
  const body = props.body
    ? props.body.map((element) => (
        <tr id={element._id} key={element._id} onClick={props.openProject}>
          <TableRow
            element={element}
            keys={props.keys}
            idsNameMap={props.idsNameMap}
            key={element._id}
          ></TableRow>
        </tr>
      ))
    : null;

  let tableFiletered = (
    <div className={classes.container}>
      <Table striped bordered hover className="mt-4" key="Project">
        <thead>
          <tr key="head">{headers}</tr>
        </thead>
        <tbody>{body}</tbody>
      </Table>
    </div>
  );

  if (props.loading) {
    tableFiletered = (
      <Spinner
        className="mt-4"
        animation="border"
        role="status"
        variant="primary"
      >
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  if (props.error && props.controlError) {
    tableFiletered = <p className="invalid mt-4"> {props.error}</p>;
  }

  return tableFiletered;
};

export default table;
