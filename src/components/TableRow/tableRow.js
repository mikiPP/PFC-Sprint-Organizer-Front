import React from 'react';

const tableRow = (props) => {
  return props.keys.map((key) => {
    //If the value is one id, gets the name of this object
    return (
      <td key={props.element[key]}>
        {!/^[a-f\d]{24}$/i.test(props.element[key])
          ? props.element[key]
          : props.idsNameMap.get(props.element[key])}
      </td>
    );
  });
};

export default tableRow;
