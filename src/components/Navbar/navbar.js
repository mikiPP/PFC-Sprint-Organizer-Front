import React from 'react';
import classes from './navbar.module.css';
import { Navbar, Container, Col, NavDropdown } from 'react-bootstrap';
import logo from '../../assets/logo.svg';
import { NavLink, Link } from 'react-router-dom';

const icon = (
  <h3>
    {sessionStorage.getItem('name')} <i className="fas fa-user"></i>
  </h3>
);

const navbar = (props) => (
  <Container className={classes.container}>
    <Navbar className={classes.navbar}>
      <Col className={classes.logoContainer}>
        <button
          onClick={(event) => {
            document
              .querySelector(`.${classes.hamburger}`)
              .classList.toggle(classes.isActive);

            document
              .querySelector(`.${classes.hamburger}`)
              .classList.toggle(classes.open);
          }}
          className={[
            classes.hamburger,
            classes.hamburgerEmphatic,
            classes.open,
          ].join(' ')}
          type="button"
        >
          <span className={classes.hamburgerBox}>
            <span className={classes.hamburgerInner}></span>
          </span>
        </button>
        <ul>
          <li>
            <NavLink to="/project"> Project </NavLink>
          </li>
          <li>
            <a href="#">Some Text 2</a>
          </li>
          <li>
            <a href="#">Some text 3</a>
          </li>
          <li>
            <a href="#">Some text 4</a>
          </li>
        </ul>
        <Link to="/">
          <Navbar.Brand>
            <img
              alt="logo"
              src={logo}
              width="70"
              height="70"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
        </Link>
      </Col>
      <Col>
        <div className={classes.authContainer}>
          <NavDropdown title={icon} id="basic-nav-dropdown">
            <NavDropdown.Item
              href="#action/3.1"
              className={classes.dropdownItem}
            >
              <div>
                <span>
                  <i className="fas fa-user-cog"></i> Config
                </span>
              </div>
            </NavDropdown.Item>
            <NavDropdown.Item
              href="#action/3.2"
              className={classes.dropdownItem}
            >
              <div>
                <span>
                  <i className="fas fa-power-off"></i> Logout
                </span>
              </div>
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      </Col>
    </Navbar>
  </Container>
);

export default navbar;