import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import Card from '../Card/card';
import Navbar from '../Navbar/navbar';
import classes from './assigment.module.css';

class Assigment extends Component {
  state = {
    object: null,
  };

  connectDraggable(event, key) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.setData(key, '');
    event.dataTransfer.effectAllowed = 'move';
  }

  connectDragEnter(event, key) {
    if (event.dataTransfer.types[1] === key.toLowerCase()) {
      event.preventDefault();
      event.target.closest('.col').classList.add(classes.droppable);
    }
  }

  connectDragOver(event) {
    event.preventDefault();
  }

  connectDrop(event, key, id) {
    const element = document.getElementById(
      event.dataTransfer.getData('text/plain'),
    );

    if (!element) {
      return;
    }

    if (element.closest('.col').id.includes(key)) {
      document
        .getElementById(id)
        .appendChild(
          document.getElementById(event.dataTransfer.getData('text/plain')),
        );

      const removeClass = document.querySelector(`.${classes.droppable}`);
      if (removeClass) {
        removeClass.classList.remove(classes.droppable);
      }

      const elementId = event.dataTransfer.getData('text/plain');
      this.props.updateOptionsAndValues(elementId, id, key);
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        <div>
          <Row className="mt-4">
            <Col>
              <h1>Element</h1>
            </Col>
            <Col>
              <h1> Options</h1>
            </Col>
          </Row>
          {this.props.keys.map((key, index) => {
            return (
              <Row className="mt-4" key={key}>
                <Col
                  className={classes.key}
                  id={key}
                  onDragEnter={(event) =>
                    this.connectDragEnter(event, `${key}_options`)
                  }
                  onDragOver={this.connectDragOver}
                  onDrop={(event) => this.connectDrop(event, key, key)}
                  onDragStart={(event) => this.connectDraggable(event, key)}
                >
                  {[this.props.keys[index]].map((element, index2) => {
                    return (
                      <div className={classes.key} key={`${element}_${index2}`}>
                        {this.props.values[index].map((innerElement) => (
                          <Card
                            cardHeader={element}
                            cardTitle={innerElement.name}
                            cardText={innerElement.description}
                            draggable={true}
                            id={innerElement._id}
                            key={innerElement._id}
                          />
                        ))}
                      </div>
                    );
                  })}
                </Col>
                <Col
                  id={`${key}_options`}
                  className={classes.key}
                  onDragStart={(event) =>
                    this.connectDraggable(event, `${key}_options`)
                  }
                  onDragEnter={(event) => this.connectDragEnter(event, key)}
                  onDragOver={this.connectDragOver}
                  onDrop={(event) =>
                    this.connectDrop(event, key, `${key}_options`)
                  }
                >
                  {[this.props.keys[index]].map((element, index2) => {
                    return (
                      <div className={classes.key} key={`${element}${index2}`}>
                        {this.props.options[index].map((innerElement) => (
                          <Card
                            cardHeader={element}
                            cardTitle={innerElement.name}
                            cardText={innerElement.description}
                            draggable={true}
                            id={innerElement._id}
                            key={innerElement._id}
                          />
                        ))}
                      </div>
                    );
                  })}
                </Col>
              </Row>
            );
          })}
        </div>
        <Button className="mt-4" onClick={this.props.save}>
          Save
        </Button>
      </div>
    );
  }
}

export default Assigment;
