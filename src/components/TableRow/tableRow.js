import React from 'react';

const tableRow = (props) => {
  return props.keys.map((key) => {
    console.log(props.element);
    return <th>{props.element[key]}</th>;
  });
};

export default tableRow;
