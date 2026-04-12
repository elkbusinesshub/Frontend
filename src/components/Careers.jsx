import React from 'react';
import logonew from '../images/logo8.gif' // Adjust the import paths as necessary
import {Image} from 'react-bootstrap'
import Footer from './Footer';

const Careers = () => {
  return (
    <div>
      <a href="/" style={{ display: 'inline-block' }}>
      <Image src={logonew} thumbnail style={{ marginTop:'20px',marginLeft:'50px',marginBottom:'20px',width: '200px',
                height: '50px', border: 'none' }} />
      </a>
      <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
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