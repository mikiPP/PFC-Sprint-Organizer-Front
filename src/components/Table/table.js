import React from 'react';
import { Table } from 'react-bootstrap';
import classes from './table.module.css';
import TableRow from '../TableRow/tableRow';

const table = (props) => {
  const headers = props.body
    ? props.headers.map((element) => <th>{element}</th>)
    : null;
  const body = props.body
    ? props.body.map((element, index) => (
        <tr key={element._id}>
          <TableRow element={element} keys={props.keys}></TableRow>
        </tr>
      ))
    : null;

  return (
    <div>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr key="head">{headers}</tr>
        </thead>
        <tbody>{body}</tbody>
      </Table>
    </div>
  );
};

export default table;
