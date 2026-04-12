// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import PostCard from "./PostCard";
// import PostModal from "./PostModal";
// import Loader from "./Loader";
// import { useSelector } from "react-redux";
// import EmptyState from "./EmptyAd";
// import NotLoggedIn from "./NotLoggedIn";
// import { useGetMyAdsQuery } from "../store/services/post.service";

// const MyBusiness = () => {
//   const [wishlist, setWishlist] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // const token = localStorage.getItem("elk_authorization_token");
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const handleCardClick = (post) => {
//     setSelectedPost(post);
//     setShowModal(true);
//   };
//   // const handleAdDeleted = (deletedAdId) => {
//   //   setWishlist((prev) => prev.filter((ad) => ad.ad_id !== deletedAdId));
//   // };

//   const { data: myAds, isLoading: myAdsLoading, refetch } = useGetMyAdsQuery( undefined,
//   { skip: !isAuthenticated });

//   // useEffect(() => {
//   //   const fetchWishlist = async () => {
//   //     try {
//   //       const res = await axios.get(
//   //         `${process.env.REACT_APP_API_BASE_URL}/api/my_ads`,
//   //         {
//   //           headers: {
//   //             Authorization: `Bearer ${token}`,
//   //           },
//   //         }
//   //       );
//   //       setWishlist(res.data);
//   //     } catch (err) {
//   //       console.error("Error fetching wishlist:", err);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   if (token) {
//   //     fetchWishlist();
//   //   } else {
//   //     setLoading(false);
//   //   }
//   // }, [token]);

//   return (
//     <>
//       <div className="main container py-4" style={{ minHeight: "80vh" }}>
//         <h1 className="mb-4">My Ads</h1>
//         {myAdsLoading ? (
//           <Loader />
//         ) : !isAuthenticated ? (
//           <div className="d-flex flex-column justify-content-center align-items-center p-5">
//             <NotLoggedIn />
//           </div>
//         ) : myAds?.ads?.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <div className="row">
//             {myAds.ads?.map((ad) => (
//               <PostCard
//                 key={ad.id}
//                 post={ad}
//                 onClick={handleCardClick}
//                 isMyAd={true}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//       <PostModal
//         show={showModal}
//         isMyAd={true}
//         onHide={() => setShowModal(false)}
//         post={selectedPost}
//         onAdDeleted={() => {
//           refetch(); 
//         }}
//       />
//     </>
//   );
// };

// export default MyBusiness;


import { useState, useCallback, useRef, useEffect } from "react";
import PostCard from "./PostCard";
import PostModal from "./PostModal";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import EmptyState from "./EmptyAd";
import NotLoggedIn from "./NotLoggedIn";
import { useGetMyAdsQuery } from "../store/services/post.service";
import './Rental.css';

const LIMIT = 10;

const MyBusiness = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const [allAds, setAllAds] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const prevDataRef = useRef(null);

  const { data: myAds, isLoading, isFetching, refetch } = useGetMyAdsQuery(
    { limit: LIMIT, offset },
    { skip: !isAuthenticated }
  );

  // Accumulate posts as offset changes
  useEffect(() => {
    if (!myAds) return;
    if (prevDataRef.current === myAds) return;
    prevDataRef.current = myAds;

    const newAds = myAds?.ads ?? [];
    const total = myAds?.total ?? 0;

    setAllAds((prev) => {
      const existingIds = new Set(prev.map((a) => a.ad_id));
      const unique = newAds.filter((a) => !existingIds.has(a.ad_id));
      return [...prev, ...unique];
    });

    setHasMore(offset + LIMIT < total);
  }, [myAds]); // eslint-disable-line react-hooks/exhaustive-deps

  // Intersection Observer sentinel
  const sentinelRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setOffset((prev) => prev + LIMIT);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetching, hasMore]
  );

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleAdDeleted = () => {
    // Reset and refetch from beginning
    setOffset(0);
    setAllAds([]);
    setHasMore(true);
    prevDataRef.current = null;
    refetch();
  };

  return (
    <>
      <div className="main container py-4" style={{ minHeight: "80vh" }}>
        <h1 className="mb-4">My Ads</h1>

        {!isAuthenticated ? (
          <div className="d-flex flex-column justify-content-center align-items-center p-5">
            <NotLoggedIn />
          </div>
        ) : isLoading && offset === 0 ? (
          <Loader />
        ) : allAds.length > 0 ? (
          <>
              <div >
              {allAds.map((ad) => (
                <PostCard
                  key={ad.ad_id}
                  post={ad}
                  onClick={handleCardClick}
                  isMyAd={true}
                />
              ))}
            </div>

            {/* Sentinel — triggers next fetch */}
            {hasMore && <div ref={sentinelRef} style={{ height: "1px" }} />}

            {/* Spinner for subsequent loads */}
            {isFetching && offset > 0 && (
              <div style={{ textAlign: "center", padding: "1rem" }}>
                <Loader />
              </div>
            )}

            {/* End of results */}
            {!hasMore && (
              <p style={{ textAlign: "center", color: "#888", padding: "1.5rem 0" }}>
                You've seen all your ads!
              </p>
            )}
          </>
        ) : (
          !isFetching && <EmptyState />
        )}
      </div>

      <PostModal
        show={showModal}
        isMyAd={true}
        onHide={() => setShowModal(false)}
        post={selectedPost}
        onAdDeleted={handleAdDeleted}
      />
    </>
  );
};

export default MyBusiness;