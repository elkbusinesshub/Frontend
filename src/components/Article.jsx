import React from 'react'
import { useState } from 'react';
import './Home.css'
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

import { Container, Row,Col,Form,Button, Modal } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel';

import working from'../images/working.jpeg'
import tools from '../images/tools.jpeg'
import rooms from '../images/rooms.jpeg'

function Article() {
  
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const emailDoc = await addDoc(collection(db, 'emails'), {
          email: email,
        });
        setEmail('');
        setShowModal(true);
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    }
  }
  const handleCloseModal = () => setShowModal(false);
  return (
    <>
      <Container className='mt-5 text-center' fluid id='blog' >
        <h5>ARTICLES AND BLOGS</h5> 
        <p>Recent Blog articles</p>
        <Row className="justify-content-center mt-5" style={{'height':'400px'}}>
          <Col xs={12} sm={12} md={4} lg={4} >
            <Carousel indicators={false}>
              <Carousel.Item>
                <img className="d-block w-100" src={working} alt="First img" style={{'height':'300px', 'width':'300px'}}/>
                <p style={{fontSize:'12px', display:'flex',justifyContent:'space-between'}}><span>Cleaning service in Peralassery </span><span >12-4-2024</span> </p>
              </Carousel.Item>
              <Carousel.Item>
                <img className="d-block w-100" src={tools} alt="Second img" style={{'height':'300px', 'width':'300px'}} />
                <p style={{fontSize:'12px', display:'flex',justifyContent:'space-between'}}><span>Tools in Kannur </span><span >12-4-2024</span> </p>
              </Carousel.Item>
              <Carousel.Item>
                <img className="d-block w-100" src={rooms} alt="Third img" style={{'height':'300px', 'width':'300px'}}/>
                <p style={{fontSize:'12px', display:'flex',justifyContent:'space-between'}}><span>New Resort in Peralassery </span><span >12-4-2024</span> </p>
              </Carousel.Item>      
            </Carousel>
          </Col>
        </Row> 
        <div className="mt-5 text-center">
          <h6 className='mt-5'>SUBSCRIBE TO OUR NEWSLETTER AND BLOG</h6>        
          <Form onSubmit={handleSubscribe}>
            <div className='form'>
              <Form.Control className='articleinput' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"/>
              <div className='space'></div>
              <Button className='articlebutton' type='submit'>Subscribe</Button>
            </div>
          </Form>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>Email added successfully!</Modal.Body>
          </Modal>
          <p className="mt-2" >
          I agree to <a href="/privacy" target="_blank">ELK Company Privacy Policy</a> and <a href="/terms" target="_blank">Terms and Conditions</a>.

          </p>
        </div>
      </Container>
    </>   
  )
}

export default Article