import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AppHeader from "./AppHeader";
import Footer from "./AppFooter";
import axios from "axios";
// import { useCookies } from "react-cookie";
import PostCard from "./PostCard";
import PostModal from "./PostModal";
import Loader from "./Loader";
import { useSelector } from 'react-redux';
import EmptyState from "./EmptyAd";
import NotLoggedIn from "./NotLoggedIn";
const MyWishList = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector(state => state.auth);
  const token = localStorage.getItem('elk_authorization_token');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleCardClick = (post) => {      
      setSelectedPost(post);
      setShowModal(true);
  };
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user_wishlists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishlist(res.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <>
      <div className="main container py-4" style={{ minHeight: "80vh" }}>
        <h1 className="mb-4">My Wishlist</h1>
        {loading ? (
          <Loader/>
        ) : !isAuthenticated ? (
          <div className="d-flex flex-column justify-content-center align-items-center p-5" >
            <NotLoggedIn />
          </div>
        ) : wishlist.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="row">
            {wishlist.map((ad) => (
              // --- FIX: Changed isMyAd from true to false ---
              <PostCard key={ad.id} post={ad} onClick={handleCardClick} isMyAd={false}/> 
              // --- End Fix ---
            ))}
          </div>
        )}
      </div>
      <Footer />
      {/* Passing isMyAd={false} to PostModal ensures delete isn't shown there either */}
      <PostModal isMyAd={false} show={showModal} onHide={() => setShowModal(false)} post={selectedPost} /> 
    </>
  );
};

export default MyWishList;