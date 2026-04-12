import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/autoplay'

import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Autoplay } from 'swiper/modules'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { Row, Col } from 'react-bootstrap'
import { FiDownload } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import app1 from '../images/app1.jpg'
import app2 from '../images/app2.jpg'
import app3 from '../images/app3.jpg'
import app4 from '../images/app4.jpg'
import app5 from '../images/app5.jpg'
import app6 from '../images/app6.jpg'
import layer1 from '../images/layer1.png'
import layer2 from '../images/layer2.png'
import './Home.css'
import astronaut from '../images/astronaut.jpg'
import Article from './Article'
import Header from './Header'
import Footer from './Footer'
import bg1 from '../images/overjoyed_webp.webp'
import bg2 from '../images/SAVE_20251012_152044.webp'
import bg3 from '../images/SAVE_20251012_152039.webp'
import popimg1 from '../images/1758433842360-removebg-preview.png'
import popimg2 from '../images/1758435179263-removebg-preview.png'
function Home() {
  const [expandedServiceJobs, setExpandedServiceJobs] = useState(false)
  const [expandedRentingOpportunities, setExpandedRentingOpportunities] =
    useState(false)
  const [expandedGettingStarted, setExpandedGettingStarted] = useState(false)
  const [expandedMaximizingEarnings, setExpandedMaximizingEarnings] =
    useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const imgs = [bg1, bg2, bg3]
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % imgs.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const texts = ['Service Now', 'Rent Now']
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length)
    }, 5000) // change every 2 seconds

    return () => clearInterval(interval)
  }, [])

  const images = [app1, app2, app3, app4, app5, app6]

  const letters = 'WHO WE ARE?'.split('')
  const founderMessage = 'MESSAGE FROM FOUNDER'.split('')
  const variants = {
    hidden: { opacity: 0 },
    show: (i) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.07 },
    }),
  }

  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })

  const swiperRef = useRef(null)

  const handleImageClick = () => {
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.stop()
    }
  }

  const handleMouseLeave = () => {
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.start()
    }
  }
  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imgs.length)
  }

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev - 1 + imgs.length) % imgs.length)
  }

  return (
    <div>
      <Header />
      <Navbar
        className="mb-0 pb-0"
        style={{
          background: '#4FBBB4',
          height: '95px',
          marginTop: '14px',
          design: 'flex',
        }}
      >
        <Container fluid>
          <Nav className="w-100 d-flex justify-content-end align-items-center">
            <Nav className="  d-flex align-items-center ">
              <Nav.Link as={Link} to="/home" className="text-white mx-3">
                Start Your Business
              </Nav.Link>
            </Nav>
          </Nav>
        </Container>
      </Navbar>

      <Container
        fluid
        className="position-relative "
        style={{ maxWidth: '100%', height: '100%', minHeight: '100vh' }}
      >
        {/* <div className="position-absolute top-0 start-0 end-0 bottom-0 " style={{backgroundImage: `url(${imgs[currentImage]})`}} id='home' >
  </div> */}
        <div
          className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-between"
          style={{ overflow: 'hidden' }}
        >
          <button
            onClick={handlePrevImage}
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              cursor: 'pointer',
              zIndex: 10,
              marginLeft: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ❮
          </button>

          <motion.div
            key={currentImage}
            className="w-100 h-100 position-absolute top-0 start-0"
            style={{
              backgroundImage: `url(${imgs[currentImage]})`,
              backgroundSize: 'cover',
            }}
            id="home"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          ></motion.div>

          <button
            onClick={handleNextImage}
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              cursor: 'pointer',
              zIndex: 10,
              marginRight: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ❯
          </button>
        </div>
        <Container className="pt-md-5">
          <div className="d-flex justify-content-center">
            {imgs[currentImage] === bg1 ? (
              <button className="rentbutton position-relative px-4 py-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={texts[index]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
                  >
                    <Link
                      to="/home"
                      style={{ textDecoration: 'none', color: 'white' }}
                    >
                      {texts[index]}
                    </Link>
                  </motion.span>
                </AnimatePresence>
              </button>
            ) : (
              <></>
            )}
          </div>

          {imgs[currentImage] === bg2 && (
            <div
              className="banner-container"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}
            >
              <div className="overlay">
                <h1 className="banner-heading">
                  The Rental
                  <br /> Revolution is Here!
                </h1>
                <h1 className="banner-sub">
                  Find what you need, hire who
                  <br /> you need, all in one hub.
                </h1>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                style={{ position: 'absolute', right: '5%', bottom: 0 }}
              >
                <img
                  src={popimg1}
                  alt="promo"
                  className="popimg"
                  style={{ maxHeight: '400px', width: 'auto' }}
                />
              </motion.div>
            </div>
          )}

          {imgs[currentImage] === bg3 && (
            <div
              className="services-banner"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}
            >
              <div className="services-overlay">
                <h1 className="services-heading">
                  Services Made
                  <br /> Simple
                </h1>
                <h1 className="services-sub">
                  Trusted Services at
                  <br /> Your Fingertips
                </h1>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                style={{ position: 'absolute', right: '5%', bottom: 0 }}
              >
                <img
                  src={popimg2}
                  alt="promo"
                  className="popimg"
                  style={{ maxHeight: '400px', width: 'auto' }}
                />
              </motion.div>
            </div>
          )}
          <motion.h1
            className=" mt-md-5 text-white"
            animate={{ scale: [0.5, 1] }}
            transition={{ duration: 5 }}
          >
            {imgs[currentImage] === bg1 ? (
              <>
                TURN YOUR STUFF AND SERVICES <br /> INTO CASH MACHINES
              </>
            ) : (
              <></>
            )}
          </motion.h1>
          {imgs[currentImage] === bg1 ? (
            <>
              <Row className="justify-content-start mt-4 ">
                <div style={{ maxWidth: '620px' }}>
                  <Swiper
                    modules={[EffectCoverflow, Autoplay]}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={1.2}
                    breakpoints={{
                      576: {
                        slidesPerView: 2,
                      },
                      768: {
                        slidesPerView: 3,
                      },
                    }}
                    loop={true}
                    autoplay={{
                      delay: 2000,
                      disableOnInteraction: false,
                    }}
                    navigation
                    coverflowEffect={{
                      rotate: 0,
                      stretch: 0,
                      depth: 150,
                      modifier: 2,
                      slideShadows: true,
                    }}
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper
                    }}
                    style={{ padding: '10px 0' }}
                  >
                    {images.map((src, i) => (
                      <SwiperSlide key={i}>
                        <img
                          src={src}
                          alt={`app${i}`}
                          onClick={handleImageClick}
                          onMouseLeave={handleMouseLeave}
                          className="img rounded"
                          style={{
                            width: '189px',
                            height: '336px',
                            cursor: 'pointer',
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </Row>
              <Row className="justify-content-start pb-5 flex-wrap mt-4">
                <Col xs="12" md="auto" className="mb-3 mb-md-0 text-center">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="https://play.google.com/store/apps/details?id=com.elkbusinesshub.elk&hl=en-US"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-btn text-white d-inline-block"
                    style={{
                      width: '189px',
                      height: '57px',
                      textAlign: 'center',
                      lineHeight: '57px',
                      textDecoration: 'none',
                    }}
                  >
                    Download App <FiDownload />
                  </motion.a>
                </Col>
                <Col xs="12" md="auto" className="mb-3 mb-md-0 text-center">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="https://play.google.com/store/apps/details?id=com.elkbusinesshub.elk&hl=en-US"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block' }}
                  >
                    <img
                      whileHover={{ scale: 1.1 }}
                      src={layer1}
                      alt="layer1"
                      className="img rounded"
                      style={{
                        width: '189px',
                        height: '57px',
                      }}
                    />
                  </motion.a>
                </Col>
                <Col xs="12" md="auto" className="text-center">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={layer2}
                    alt="layer2"
                    className="img rounded"
                    style={{
                      width: '189px',
                      height: '57px',
                    }}
                  />
                </Col>
              </Row>
            </>
          ) : (
            <></>
          )}
        </Container>
      </Container>

      <div
        fluid
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${astronaut})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          padding: '0',
          margin: '0',
          zIndex: '-1',
        }}
        id="aboutus"
      >
        <Row className="align-items-center">
          <Col md={6} style={{ paddingLeft: '0' }}></Col>
          <Col md={6} style={{ padding: '40px', color: '#fff' }}>
            <div style={{ padding: '20px' }}>
              <motion.h3
                ref={ref}
                initial="hidden"
                animate={isInView ? 'show' : 'hidden'}
                variants={variants}
              >
                {letters.map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    variants={variants}
                    custom={i}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h3>

              <motion.p>
                ELK is an online platform for renting and services, making it
                simple to get what you need with a single click. We give you the
                tools to easily turn your assets and services into money-making
                opportunities. ELK helps you modernize your rental business with
                ease. Our user-friendly platform makes everything simple, from
                managing inventory to handling service tasks, all in one place.
                With ELK, property owners can grow their business without any
                hassle, while customers benefit from a seamless rental
                experience and quick access to services.
              </motion.p>
              <motion.h4
                style={{ marginTop: '70px' }}
                ref={ref}
                initial="hidden"
                animate={isInView ? 'show' : 'hidden'}
                variants={variants}
              >
                {founderMessage.map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    variants={variants}
                    custom={i}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h4>
              <p>
                The future of business is out of this world.
                <br />
                <strong className="d-flex justify-content-end">
                  - Jimson PS
                  <br /> Founder and MD of ELK
                </strong>
              </p>
            </div>
          </Col>
        </Row>
      </div>
      <Container
        fluid
        style={{ overflowX: 'hidden', padding: 0, backgroundColor: '#FDD77F' }}
        id="elk"
      >
        <Row
          style={{ width: '90%', marginLeft: '5%' }}
          className="justify-content-center no-gutters"
        >
          <Col md={10} className="mt-5">
            <h3 className="text-center mt-4">WHAT IS ELK PLATFORM?</h3>
            <motion.p className="text-center description">
              ELK Platform is a dynamic online marketplace that connects service
              providers with consumers seeking various services and rental
              options. It serves as a hub for individuals to offer their skills,
              expertise, and resources to a wide audience. Overview of its
              Service Jobs and Renting Opportunities. ELK Platform provides two
              primary avenues for earning money: service jobs and renting
              opportunities. Service jobs encompass a wide range of tasks and
              services that individuals can offer, while renting opportunities
              involve renting out personal belongings or spaces for temporary
              use.
            </motion.p>
          </Col>
        </Row>
        <Row
          style={{ width: '90%', marginLeft: '5%' }}
          className="justify-content-center no-gutters"
        >
          <Col md={5} className="mt-5" style={{ fontSize: '15px' }}>
            <h5>1- UNDERSTANDING SERVICE JOBS</h5>
            <p className="mt-3 word-description">
              Explanation of Service Jobs on ELK Platform
              <br />
              The ELK BUSINESS HUB is an online platform which acts as a meeting
              point between people who want to perform some services and people
              who need them. Whether you are a professional who wants to offer
              his services or a client in search of a professional, ELK is the
              solution. In addition to this, the platform provides various
              categories for different services including home services,
              freelance services and many more.{' '}
              {expandedServiceJobs && (
                <>
                  It aims at providing an efficient platform that brings
                  together people who need certain services with those who can
                  provide them at their convenience.
                </>
              )}
            </p>
            <span
              style={{ cursor: 'pointer', fontStyle: 'italic' }}
              onClick={() => setExpandedServiceJobs(!expandedServiceJobs)}
            >
              {expandedServiceJobs ? 'Read Less<<' : 'Read More>>'}
            </span>
          </Col>
          <Col md={5} className="mt-5" style={{ fontSize: '15px' }}>
            <h5>2- EXPLORING RENTING OPPORTUNITIES</h5>
            <p className="mt-3 word-description">
              Overview of Renting Opportunities Provided by ELK Platform
              <br />
              In addition to service jobs, ELK Platform offers renting
              opportunities for individuals with assets to spare. From tools and
              equipment to vehicles and properties, there's no shortage of items
              and spaces available for rent. Examples of Items or Spaces that
              Can Be Rented Tools and machinery for construction or DIY
              projects.{' '}
              {expandedRentingOpportunities && (
                <>
                  Vehicles for transportation or special occasions. Properties
                  for short-term accommodations or events.
                </>
              )}
            </p>
            <span
              style={{ cursor: 'pointer', fontStyle: 'italic' }}
              onClick={() =>
                setExpandedRentingOpportunities(!expandedRentingOpportunities)
              }
            >
              {expandedRentingOpportunities ? 'Read Less<<' : 'Read More>>'}
            </span>
          </Col>
        </Row>
        <Row
          style={{ width: '90%', marginLeft: '5%' }}
          className="justify-content-center no-gutters mb-5"
        >
          <Col md={5} className="mt-5" style={{ fontSize: '15px' }}>
            <h5>3- HOW TO GET STARTED</h5>
            <p className="mt-3 word-description">
              Steps to Join ELK Platform
              <br />
              Getting started with ELK Platform is simple and straightforward.
              Follow these steps to begin your journey: Sign up for an account
              on the ELK Platform website or mobile app. Complete your profile
              with accurate information and a compelling bio. Browse through
              available service jobs and renting opportunities. Apply for jobs
              or list your own services and rental items.
              {expandedGettingStarted && (
                <>
                  Communicate with potential clients and finalize agreements.
                  Fulfill your commitments professionally and efficiently.
                </>
              )}
            </p>
            <span
              style={{ cursor: 'pointer', fontStyle: 'italic' }}
              onClick={() => setExpandedGettingStarted(!expandedGettingStarted)}
            >
              {expandedGettingStarted ? 'Read Less<<' : 'Read More>>'}
            </span>
          </Col>
          <Col md={5} className="mt-5" style={{ fontSize: '15px' }}>
            <h5>4- TIPS FOR MAXIMIZING EARNINGS</h5>
            <p className="mt-3 word-description">
              Strategies for Success on ELK Platform
              <br />
              To make the most out of your experience on ELK Platform, consider
              the following tips: Optimize Your Listings: Use descriptive
              titles, high-quality images, and competitive pricing to attract
              potential clients. Provide Excellent Service : Deliver exceptional
              results and prioritize customer satisfaction to build a positive
              reputation. Promote Your Services: Leverage social media,
              word-of-mouth referrals, and networking opportunities to expand
              your client base.
              {expandedMaximizingEarnings && (
                <>
                  Stay Organized: Keep track of your appointments, tasks, and
                  earnings to ensure smooth operations and timely delivery.
                </>
              )}
            </p>
            <span
              style={{ cursor: 'pointer', fontStyle: 'italic' }}
              onClick={() =>
                setExpandedMaximizingEarnings(!expandedMaximizingEarnings)
              }
            >
              {expandedMaximizingEarnings ? 'Read Less<<' : 'Read More>>'}
            </span>
          </Col>
        </Row>
        <Row className="justify-content-center mb-5">
          <Col xs="auto">
            <button className="adbutton">
              <Link
                to="/home"
                style={{ textDecoration: 'none', color: 'white' }}
              >
                Post Your Ad for free
              </Link>
            </button>
          </Col>
        </Row>
      </Container>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          backgroundColor: 'white',
          color: 'black',
          textAlign: 'center',
          padding: '1rem',
          zIndex: 1000,
          fontSize: '15px',
        }}
      >
        <motion.span
          animate={{ x: [0, -30, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ display: 'inline-block', marginRight: '0.5rem' }}
        >
          🚀
        </motion.span>{' '}
        Ready to get started?
        <button className="adbutton">
          {' '}
          <Link to="/home" style={{ textDecoration: 'none', color: 'white' }}>
            Start Your Free Account
          </Link>
        </button>
      </div>

      <Article />
      {/* <Customer/> */}
      <Footer />
    </div>
  )
}

export default Home
