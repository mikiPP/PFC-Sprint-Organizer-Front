import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import Card from '../Card/card';
import Navbar from '../Navbar/navbar';
import Axios from 'axios';
import classes from './assigment.module.css';

class Assigment extends Component {
  state = {
    object: null,
  };

  componentDidMount() {
    // if (!this.props.object) {
    //   const url = `${this.props.objectName}/${this.props.id}`;
    //   console.log(url);
    //   Axios.get(url)
    //     .then((result) => {
    //       this.setState({ object: result.data[this.props.objectName] });
    //     })
    //     .catch((err) => console.error(err));
    // }
  }

  connectDraggable(event, key) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.setData(key, '');
    event.dataTransfer.effectAllowed = 'move';
  }

  connectDragEnter(event, key) {
    console.log(event.dataTransfer.types[1], key.toLowerCase());
    if (event.dataTransfer.types[1] === key.toLowerCase()) {
      event.preventDefault();
      event.target.closest('.col').classList.add(classes.droppable);
    }
  }

  connectDragOver(event) {
    event.preventDefault();
  }

  connectDrop(event, key, id) {
    const element = document
      .getElementById(event.dataTransfer.getData('text/plain'))
      .closest('.col');

    if (!element) {
      return;
    }

    if (element.id.includes(key)) {
      document
        .getElementById(id)
        .appendChild(
          document.getElementById(event.dataTransfer.getData('text/plain')),
        );

      document
        .querySelector(`.${classes.droppable}`)
        .classList.remove(classes.droppable);
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        {/* <h1>
          Hi from assigment{' '}
          {this.props.object ? this.props.object.name : this.state.object.name}
        </h1> */}
        <div>
          {this.props.keys.map((key, index) => {
            return (
              <Row className="mt-4" key={key}>
                <Col
                  id={key}
                  className={classes.key}
                  onDragEnter={(event) =>
                    this.connectDragEnter(event, `${key}_options`)
                  }
                  onDragOver={this.connectDragOver}
                  onDrop={(event) => this.connectDrop(event, key, key)}
                >
                  <h1>{key}</h1>
                </Col>
                <Col
                  id={`${key}_options`}
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
        <Button className="mt-4"> Save</Button>
      </div>
    );
  }
}

export default Assigment;
