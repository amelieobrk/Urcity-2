import React from 'react';
import { Nav, Navbar, Dropdown } from 'react-bootstrap';
import { Link, } from 'react-router-dom';
import Einloggen from '../login_button';
import Head from 'next/head';

export default function Header() {
  return (
    <Navbar bg="primary" variant="dark" expand="sm">
      <Navbar.Brand as={Link} to="/">
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Dropdown>
              <Dropdown.Item><Einloggen></Einloggen></Dropdown.Item>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}