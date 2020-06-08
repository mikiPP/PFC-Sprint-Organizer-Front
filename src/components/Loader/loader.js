import React from 'react';
import classes from './loader.module.css';

const loader = (props) => (
  <section className={classes.container}>
    <div className={classes.loader}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </section>
);

export default loader;
