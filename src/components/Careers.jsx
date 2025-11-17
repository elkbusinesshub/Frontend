import React from 'react';
// import logonew from '../images/logonew.jpg' // Removed this import
// import { Image } from 'react-bootstrap';      // Removed this import
import Footer from './Footer';

const Careers = () => {
  return (
    // Replaced outer div with the flex container for layout
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Removed the logo rendering section */}
      {/*
      <a href="/" style={{ display: 'inline-block' }}>
      <Image src={logonew} thumbnail style={{ marginTop:'30px',marginLeft:'50px',marginBottom:'30px',width: '208px', height: '80px', border: 'none' }} />
      </a>
      */}

      {/* Content area */}
      <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1, // Let this fill the space
          height: '100vh', // Keep height if you want gradient only here, adjust if needed
          textAlign: 'center',
          background: 'linear-gradient(180deg, #F5CC40 0%, #4FBBB4 100%)',
        }}>
        <h2 style={{ color: 'white' }}>"Thank you for your interest, <br/>
          but there are no job openings available at this time. <br/>
          Please check back at another time."</h2>
      </div>
      <Footer/>
    </div>
  );
};

export default Careers;