import React, { useEffect, useState } from 'react';
import { Modal, Button, Carousel } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import ChatIcon from '@mui/icons-material/Chat';
import ShareIcon from '@mui/icons-material/Share';
import dayjs from 'dayjs';
import FullscreenImageView from './FullscreenImageView';
import './PostModal.css';
import { MdDeleteForever } from "react-icons/md";

const PostModal = ({ show, onHide, post, isMyAd, onDeleteAd }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [adDetails, setAdDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fullscreenState, setFullscreenState] = useState({
    isOpen: false,
    images: [],
    startIndex: 0,
  });

  const token = localStorage.getItem('elk_authorization_token');

  // --- SHARE HANDLER ---
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/ad/${adDetails?.id}`;
    if (navigator.share && adDetails) {
      navigator
        .share({
          title: adDetails.title,
          text: adDetails.description,
          url: shareUrl,
        })
        .catch(err => console.error('Share failed:', err));
    } else if (adDetails) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => alert('Ad link copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  // --- FULLSCREEN HANDLER ---
  const openFullscreen = (images, startIndex) => {
    handleClose(); // close modal before opening fullscreen
    setFullscreenState({
      isOpen: true,
      images: images.map(img => img.image),
      startIndex,
    });
  };

  // --- FETCH AD DETAILS ---
  useEffect(() => {
    const getAdDetails = async (adId) => {
      if (!adId) return;
      const body = { ad_id: adId, user_id: user?.user_id || null };
      try {
        setLoading(true);
        setError(false);
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/get_ad_details`,
          body,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            'Content-Type': 'application/json',
          }
        );
        setAdDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch ad details:', error.response?.data || error.message);
        setError(true);
        setAdDetails(null);
      } finally {
        setLoading(false);
      }
    };

    if (show && post?.ad_id) getAdDetails(post.ad_id);
    else if (!show) {
      setAdDetails(null);
      setError(false);
    }
  }, [post?.ad_id, token, user?.user_id, show]);

  const handleClose = () => {
    setAdDetails(null);
    setError(false);
    setFullscreenState({ isOpen: false, images: [], startIndex: 0 });
    onHide();
  };

  // --- CONDITIONAL RENDER STATES ---
  if (loading && show) {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body><Loader /></Modal.Body>
      </Modal>
    );
  }

  if (error && show) {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Error</Modal.Title></Modal.Header>
        <Modal.Body>Failed to load ad details. Please try again later.</Modal.Body>
      </Modal>
    );
  }

  if (!adDetails && show) return null;

  // --- DATA PROCESSING ---
  const postDateTime = adDetails
    ? dayjs(adDetails.createdAt).format('MMM D, YYYY [at] h:mm A')
    : '';
  const locationString = adDetails
    ? [
        adDetails.ad_location?.locality,
        adDetails.ad_location?.place,
        adDetails.ad_location?.district,
        adDetails.ad_location?.state,
        adDetails.ad_location?.country,
      ]
        .filter(Boolean)
        .join(', ')
    : '';

  return (
    <>
      {!fullscreenState.isOpen && (
        <Modal show={show} onHide={handleClose} centered size="lg">
          {adDetails && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{adDetails.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* IMAGE CAROUSEL */}
                {adDetails.ad_images && adDetails.ad_images.length > 0 ? (
                  <Carousel
                    interval={null}
                    controls={adDetails.ad_images.length > 1}
                    style={{ maxHeight: '400px', overflow: 'hidden' }}
                  >
                    {adDetails.ad_images.map((image, index) => (
                      <Carousel.Item
                        key={index}
                        onClick={() => openFullscreen(adDetails.ad_images, index)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={image.image}
                          alt={`Slide ${index + 1}`}
                          className="d-block w-100 img-fluid rounded"
                          style={{
                            maxHeight: '400px',
                            objectFit: 'contain',
                          }}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center text-muted"
                    style={{
                      height: '200px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                    }}
                  >
                    No Image Available
                  </div>
                )}

                {/* AD DETAILS */}
                <div className="mt-3">
                  <p className="text-muted small">Post ID: {adDetails.id}</p>
                  <p className="text-muted small">Posted on {postDateTime}</p>
                  <p><strong>Category:</strong> {adDetails.category}</p>
                  <p><strong>Description:</strong> {adDetails.description}</p>
                  <strong>Price:</strong>{' '}
                  {adDetails.ad_price_details?.length > 0 ? (
                    adDetails.ad_price_details.map((price, index) => (
                      <span key={index} className="d-block ms-2">
                        ₹{price.rent_price ?? 'N/A'} per {price.rent_duration || 'unit'}
                      </span>
                    ))
                  ) : (
                    <span> N/A</span>
                  )}
                  <p className="mt-2">
                    <i className="fa-solid fa-location-dot me-1"></i>
                    {locationString || 'Location not specified'}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top flex-wrap gap-2">
                  {/* LEFT: Share + Delete */}
                  <div className="d-flex align-items-center gap-3">
                    <ShareIcon
                      onClick={handleShare}
                      fontSize="large"
                      sx={{ color: '#4FBBB4', cursor: 'pointer' }}
                    />
                    {isAuthenticated && isMyAd && onDeleteAd && (
                      <MdDeleteForever
                        size={35}
                        color="red"
                        onClick={() => onDeleteAd(adDetails.id)}
                        style={{
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        title="Delete Ad"
                      />
                    )}
                  </div>

                  {/* RIGHT: Chat + View Profile */}
                  <div className="d-flex align-items-center gap-3">
                    {isAuthenticated && !isMyAd && adDetails.user_id !== user?.user_id && (
                      <ChatIcon
                        onClick={() =>
                          navigate('/chat', {
                            state: {
                              userId: adDetails.user_id,
                              userName: adDetails.user?.name || 'User',
                              adId: adDetails.id,
                              adName: adDetails.title,
                            },
                          })
                        }
                        fontSize="large"
                        sx={{ color: '#4FBBB4', cursor: 'pointer' }}
                      />
                    )}

                    <Button
                      variant="primary"
                      size="sm"
                      style={{
                        backgroundColor: '#4FBBB4',
                        borderColor: '#4FBBB4',
                      }}
                      onClick={() => {
                        if (isAuthenticated && adDetails.user_id) {
                          navigate(`/user-profile/${adDetails.user_id}`);
                          handleClose();
                        } else {
                          navigate('/login');
                        }
                      }}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </>
          )}
        </Modal>
      )}

      {/* FULLSCREEN VIEWER */}
      {fullscreenState.isOpen && (
        <FullscreenImageView
          images={fullscreenState.images}
          startIndex={fullscreenState.startIndex}
          onClose={() =>
            setFullscreenState({ isOpen: false, images: [], startIndex: 0 })
          }
        />
      )}
    </>
  );
};

export default PostModal;
