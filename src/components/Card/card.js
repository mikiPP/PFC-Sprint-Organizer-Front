import React from 'react';
import { Card } from 'react-bootstrap';
import classes from './card.module.css';
import { Spinner } from 'react-bootstrap';

const card = (props) => {
  return (
    <Card
      border="primary"
      style={{ width: '18rem' }}
      draggable={props.draggable}
      id={props.id}
      className="my-2 mx-2"
    >
      <Card.Header className={classes.cardHeader}>
        {props.cardHeader}
      </Card.Header>
      <Card.Body className={classes.cardBody}>
        <Card.Title>{props.cardTitle}</Card.Title>
        <Card.Text>{props.cardText}</Card.Text>
      </Card.Body>
    </Card>
  );
};
export default card;
