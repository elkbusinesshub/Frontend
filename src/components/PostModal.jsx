import React, { useEffect, useState } from 'react'
import { Modal, Button, Carousel } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
// import { useCookies } from "react-cookie";
import Loader from './Loader'
import ChatIcon from '@mui/icons-material/Chat'
import ShareIcon from '@mui/icons-material/Share'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import DeleteIcon from '@mui/icons-material/Delete'
import FullscreenImageView from './FullScreenImageView'
import { useDeleteAdMutation } from '../store/services/superadmin.service'
import { successMessageToast } from './common/hooks/common'
import {
  useAddWishlistMutation,
  useGetAdDetailsQuery,
} from '../store/services/post.service'
import { useRemoveWishlistMutation } from '../store/services/user.service'

const PostModal = ({ show, onHide, post, isMyAd, onAdDeleted }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  // const [adDetails, setAdDetails] = useState(null);
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('elk_authorization_token')
  const [error, setError] = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [fullscreenIndex, setFullscreenIndex] = useState(0)
  const [deleteAd, { isLoading: deleteAdLoading }] = useDeleteAdMutation()
  const [addWishlist, { isLoading: addWishlistLoading }] =
    useAddWishlistMutation()
  const [removeWishlist, { isLoading: removeWishlistLoading }] =
    useRemoveWishlistMutation()

  const {
    data: adDetails,
    isLoading: adDetailLoading,
    refetch,
  } = useGetAdDetailsQuery(
    { ad_id: post?.ad_id, user_id: user?.user_id },
    {
      skip: !post?.ad_id,
    },
  )
  const handleShare = () => {
    const shareUrl = `https://api.elkcompany.online/ad/${adDetails.id}`
    if (navigator.share) {
      navigator
        .share({
          title: adDetails.title,
          text: adDetails.description,
          url: shareUrl,
        })
        .catch((err) => console.error('Share failed:', err))
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => alert('Ad link copied to clipboard!'))
        .catch((err) => console.error('Failed to copy:', err))
    }
  }
  const handleDeleteAd = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this ad?',
    )
    if (!confirmDelete) return

    try {
      // const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/delete-ad?id=${id}`);
      const response = await deleteAd(id)
      if (response.data.success) {
        // alert("Ad deleted successfully!");
        successMessageToast(response?.message)
        if (onAdDeleted) onAdDeleted(post.ad_id) // 👈 notify parent to remove the ad
        onHide() // 👈 close modal
      }
      // else {
      //   alert(response?.data?.message || "Failed to delete ad.");
      // }
    } catch (error) {
      console.error('Error deleting ad:', error.response?.data || error.message)
      // alert(error.response?.data?.message || "Failed to delete ad.");
    }
  }

  // const getAdDetails = async (adId, token) => {
  //   let body = {};
  //   if (token) {
  //     const userId = user?.user_id;
  //     body = { ad_id: adId, user_id: userId };
  //   } else {
  //     body = { ad_id: adId };
  //   }
  //   try {
  //     setLoading(true);
  //     setError(false);
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_BASE_URL}/api/get_ad_details`,
  //       body,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     setLoading(false);
  //     return response.data;
  //   } catch (error) {
  //     setLoading(false);
  //     setError(true);
  //     console.error(
  //       "Failed to fetch ad details:",
  //       error.response?.data || error.message
  //     );
  //     return null;
  //   }
  // };

  // useEffect(() => {
  //   if (!post?.ad_id) return;
  //   const fetchAd = async () => {
  //     try {
  //       const data = await getAdDetails(post.ad_id, token);
  //       if (data) setAdDetails(data);
  //     } catch (err) {}
  //   };
  //   fetchAd();
  // }, [post?.ad_id, token]);

  const toggleWishlist = async () => {
    if (!adDetails || !token) return

    // const url = adDetails.wishListed
    //   ? `${process.env.REACT_APP_API_BASE_URL}/api/remove_wishlist`
    //   : `${process.env.REACT_APP_API_BASE_URL}/api/add_to_wishlist`;

    try {
      // await axios.post(
      //   url,
      //   { ad_id: adDetails.id },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      let res
      if (adDetails.wishListed) {
        res = await removeWishlist({ ad_id: adDetails.id })
      } else {
        res = await addWishlist({ ad_id: adDetails.id })
      }
      console.log('res..', res)
      refetch()
      successMessageToast(res?.message)
      // setAdDetails((prev) => ({
      //   ...prev,
      //   wishListed: !prev.wishListed,
      // }));
    } catch (error) {
      console.error(
        'Wishlist update error:',
        error.response?.data || error.message,
      )
    }
  }

  if (loading) return <Loader />
  if (error) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Failed to load ad details. Please try again later.
        </Modal.Body>
      </Modal>
    )
  }
  if (!adDetails) return null
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{adDetails.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {adDetails.ad_images && adDetails.ad_images.length > 1 ? (
          <Carousel>
            {adDetails.ad_images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  src={image.image}
                  alt={`Slide ${index + 1}`}
                  className="d-block w-100 img-fluid rounded"
                  style={{
                    maxHeight: '250px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setFullscreenIndex(index)
                    setShowFullscreen(true)
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <img
            src={adDetails.ad_images[0]?.image}
            alt={adDetails.title}
            className="img-fluid rounded mb-3 w-100"
            style={{
              maxHeight: '250px',
              objectFit: 'cover',
              cursor: 'pointer',
            }}
            onClick={() => {
              setShowFullscreen(true)
              setFullscreenIndex(0)
            }}
          />
        )}
        <FullscreenImageView
          show={showFullscreen}
          onClose={() => setShowFullscreen(false)}
          images={adDetails.ad_images || []}
          initialIndex={fullscreenIndex}
        />
        <div className="mt-3">
          <p
            className="text-muted fs-6"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            Post ID: {adDetails.id}
          </p>
          <p>
            <strong>Category:</strong> {adDetails.category}
          </p>
          <p>
            <strong>Description:</strong> {adDetails.description}
          </p>

          <p>
            <strong>Price:</strong>{' '}
            {adDetails.ad_price_details?.length > 0 ? (
              adDetails.ad_price_details.map((price, index) => (
                <span key={index}>
                  {price.rent_price}
                  per {price.rent_duration}
                  {index < adDetails.ad_price_details.length - 1 && ' | '}
                </span>
              ))
            ) : (
              <a
                onClick={(e) => {
                  e.preventDefault()
                  navigate(`/user-profile/${adDetails.user_id}`)
                }}
                style={{ textDecoration: 'none', color: '#4FBBB4' }}
              >
                Get Price
              </a>
            )}
          </p>
          <p>
              <i className="fa-solid fa-location-dot me-1"></i>
              {[
                post.ad_location.locality,
                post.ad_location.place,
                post.ad_location.district,
                post.ad_location.state,
                post.ad_location.country,
              ]
                .filter(Boolean) 
                .join(', ')}
            </p>
        </div>
        <div className="d-flex flex-row justify-content-between align-items-center mt-4 flex-wrap">
          {!isMyAd ? (
            <button
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                padding: '0',
                cursor: 'pointer',
              }}
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login')
                } else {
                  toggleWishlist()
                }
              }}
            >
              {adDetails.wishListed ? (
                <FavoriteIcon
                  fontSize="large"
                  sx={{ color: '#4FBBB4', margin: '0 20px', cursor: 'pointer' }}
                />
              ) : (
                <FavoriteBorderIcon
                  fontSize="large"
                  sx={{ color: '#4FBBB4', margin: '0 20px', cursor: 'pointer' }}
                />
              )}
            </button>
          ) : (
            <></>
          )}
          <ShareIcon
            onClick={() => handleShare()}
            fontSize="large"
            sx={{ color: '#4FBBB4', cursor: 'pointer' }}
          />
          {isAuthenticated && !isMyAd ? (
            <ChatIcon
              onClick={() =>
                navigate('/chat', {
                  state: {
                    userId: adDetails.user_id,
                    userName: adDetails.user.name,
                    adId: adDetails.id,
                    adName: adDetails.title,
                    profile: adDetails.user.profile,
                  },
                })
              }
              fontSize="large"
              sx={{ color: '#4FBBB4', margin: '0 20px', cursor: 'pointer' }}
            />
          ) : (
            <></>
          )}
          {isMyAd ? (
            <DeleteIcon
              onClick={() => handleDeleteAd(adDetails.id)}
              fontSize="large"
              sx={{ color: '#ad1616ff', margin: '0 20px', cursor: 'pointer' }}
            />
          ) : (
            <></>
          )}
          {isAuthenticated ? (
            <Button
              style={{
                borderRadius: '12px',
                backgroundColor: '#4FBBB4',
                borderColor: '#4FBBB4',
                padding: '4px 12px',
                fontSize: '0.8rem',
                lineHeight: 1.2,
              }}
              onClick={() => navigate(`/user-profile/${adDetails.user_id}`)}
            >
              View Profile
            </Button>
          ) : (
            <Button
              style={{
                borderRadius: '12px',
                backgroundColor: '#4FBBB4',
                borderColor: '#4FBBB4',
                padding: '4px 12px',
                fontSize: '0.8rem',
                lineHeight: 1.2,
              }}
              onClick={() => navigate('/login')}
            >
              View Profile
            </Button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PostModal
