import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logonewGif from "../images/logonew.gif.gif"; // [cite: uploaded:logonew.gif.gif-1e6158f0-7758-4f5c-a254-7840c22988fc]
import logonewJpg from "../images/logonew.jpg";     // [cite: uploaded:src/images/logonew.jpg]


import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Header() {
  const location = useLocation(); 
  const logoRef = useRef(null);
  const isInView = useInView(logoRef, { once: false });

  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navExpanded, setNavExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setVisible(window.scrollY < lastScrollY || window.scrollY < 50);
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  
  const { pathname } = location;
  let logoSrc;
  let logoStyle;

  if (pathname === '/') {
    
    logoSrc = logonewGif;
    logoStyle = {
      width: scrolled ? "350px" : "400px",
      height: scrolled ? "80px" : "90px", // Adjusted height for GIF
    };
  } else {
    
    logoSrc = logonewJpg;
    logoStyle = {
      width: scrolled ? "250px" : "300px",
      height: scrolled ? "80px" : "90px",
    };
  }
  

  // This logic now correctly *hides* links on careers/privacy
  const hideNavLinksCompletely = ['/careers', '/privacy', '/terms'].includes(pathname);

  const handleNavClick = () => {
    setNavExpanded(false);
  };


 const handleInternalLinkClick = (hash, e) => {
    setNavExpanded(false);
    if (location.pathname === '/') {
      e.preventDefault();
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    }
 };


  return (
    <Navbar
      expand="lg"
      sticky="top"
      className={`shadow-sm bg-white mb-0 transition-navbar ${scrolled ? "navbar-scrolled" : ""} ${visible ? "navbar-visible" : "navbar-hidden"}`}
      expanded={navExpanded}
      onToggle={setNavExpanded}
    >
      <Container className="pt-2">
        <Navbar.Brand as={Link} to="/" className="d-flex flex-column align-items-center" style={{ marginLeft: '-30px' }}>
           <motion.img
            ref={logoRef}
            initial={{ y: -100, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
            
            src={logoSrc}
            alt="logo header"
            style={{
              ...logoStyle, 
              border: "none",
              transition: "all 0.3s ease",
              pointerEvents: "none",
            }}
            
          />
        </Navbar.Brand>

        
        {!hideNavLinksCompletely && (
          <>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav" style={{ zIndex: "1000" }}>
              <Nav className="ms-auto">
                <Nav.Link href="#home" className="ms-5" onClick={(e) => handleInternalLinkClick('#home', e)}>Home</Nav.Link>
                <Nav.Link href="#aboutus" className="ms-5" onClick={(e) => handleInternalLinkClick('#aboutus', e)}>About Us</Nav.Link>
                <Nav.Link href="#elk" className="ms-5 fw-bold" onClick={(e) => handleInternalLinkClick('#elk', e)}>ELK Platform</Nav.Link>
                <Nav.Link href="#blog" className="ms-5" onClick={(e) => handleInternalLinkClick('#blog', e)}>Blog</Nav.Link>
                
                {/* --- FIX: Added "Contacts" text back --- */}
                <Nav.Link
                    as={Link}
                    to="/privacy"
                    className="ms-5"
                    onClick={() => {
                        handleNavClick();
                        setTimeout(() => {
                            const element = document.getElementById("contactsinprivacy");
                            if (element) {
                                element.scrollIntoView({ behavior: "smooth" });
                            }
                        }, 0);
                    }}
                >
                  Contacts 
                </Nav.Link>
                {/* --- End Fix --- */}

                <Nav.Link as={Link} to="/careers" className="ms-5" onClick={handleNavClick}>Careers</Nav.Link>
                <Nav.Link as={Link} to="/login" className="ms-5 fw-bold" onClick={handleNavClick}>Sign Up</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;