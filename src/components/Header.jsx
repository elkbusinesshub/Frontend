import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'

import logonew from '../images/logo8.gif'

import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

import './Header.css'

function Header() {
  const logoRef = useRef(null)
  const isInView = useInView(logoRef, { once: false })

  return (
    <>
      <Navbar className="site-header" expand="lg">
        <Container className="pt-2 pb-2">
          <Navbar.Brand
            href="#logo"
            className="d-flex flex-column align-items-center"
          >
            {/* <motion.img ref={logoRef}
              initial={{ y: -100, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ type: 'spring', stiffness: 120, damping: 10 }}
              src={logonew} thumbnail style={{ width: '208px', height: '80px', border: 'none' }} alt='logo header' /> */}
            <motion.img
              ref={logoRef}
              // initial={{ y: -30, opacity: 0 }}
              // animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 10 }}
              src={logonew}
              style={{
                width: '200px',
                height: '50px',
                border: 'none',
                background: 'transparent',
                mixBlendMode: 'multiply',
              }}
              alt="logo header"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav" style={{ zIndex: '1000' }}>
            <Nav className="ms-auto">
              <Nav.Link href="#home" className="ms-5 ">
                Home
              </Nav.Link>
              <Nav.Link href="#aboutus" className="ms-5 ">
                About Us
              </Nav.Link>
              <Nav.Link href="#elk" className="ms-5 fw-bold ">
                ELK Platform
              </Nav.Link>
              <Nav.Link href="#blog" className="ms-5 ">
                Blog
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/privacy"
                className="ms-5"
                onClick={() => {
                  setTimeout(() => {
                    const element = document.getElementById('contactsinprivacy')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }, 0)
                }}
              >
                Contacts
              </Nav.Link>

              <Nav.Link as={Link} to="/careers" className="ms-5">
                Careers
              </Nav.Link>
              <Nav.Link as={Link} to="/login" className="ms-5 fw-bold">
                Sign Up
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="site-header-placeholder" aria-hidden="true" />
    </>
  )
}

export default Header
