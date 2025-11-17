import React, { useEffect, useState } from "react"; // Added useState
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer"; // Added Footer import
import axios from "axios";
import PostCard from "./PostCard"; // Added PostCard import
import PostModal from "./PostModal"; // Added PostModal import
import Loader from "./Loader"; // Added Loader import
import EmptyState from "./EmptyAd"; // Added EmptyState import
import { useParams } from 'react-router-dom'; // Added useParams import

const SearchResult = () => {
    // --- FIX: Added State Definitions ---
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    // --- End Fix ---

    // --- FIX: Added handleCardClick function ---
    const handleCardClick = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };
    // --- End Fix ---

    const { query } = useParams(); // useParams is now defined

    useEffect(() => {
        const fetchAds = async () => {
          setLoading(true); // setLoading is now defined
          try {
              const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/search_ad`,
                { keyword: query }
              );
              setAds(res.data.data); // setAds is now defined
          } catch (err) {
            console.error("Error fetching search results:", err);
            setAds([]); // Set to empty array on error
          } finally {
              setLoading(false); // setLoading is now defined
          }
        };
        fetchAds();
    }, [query]);

  return (
    <>
      <div className="main container py-4" style={{ minHeight: "80vh" }}>
        <h1 className="mb-4" style={{textTransform:'capitalize'}}>Search result of {query}</h1>
        {loading ? ( // loading is now defined
          <Loader/> // Loader is now defined
        ) : ads.length === 0 ? ( // ads is now defined
          <EmptyState/> // EmptyState is now defined
        ) : (
          <div className="row">
            {ads.map((ad) => ( // ads is now defined
                // Wrap PostCard in grid column div
                <div key={ad.id} className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
                   <PostCard post={ad} onClick={handleCardClick} isMyAd={false}/> {/* handleCardClick is now defined */}
                </div>
            ))}
          </div>
        )}
      </div>
      <Footer /> {/* Footer is now defined */}
      {/* Passing isMyAd={false} to PostModal ensures delete isn't shown there either */}
      <PostModal
          isMyAd={false}
          show={showModal} /* showModal is now defined */
          onHide={() => setShowModal(false)} /* setShowModal is now defined */
          post={selectedPost} /* selectedPost is now defined */
      />
    </>
  );
};

export default SearchResult;