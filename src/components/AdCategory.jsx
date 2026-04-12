import { useState, useCallback, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AppHeader from "./AppHeader";
import Footer from "./AppFooter";
import PostCard from "./PostCard";
import PostModal from "./PostModal";
import Loader from "./Loader";
import EmptyState from "./EmptyAd";
import { useSelector } from "react-redux";
import { useGetRentCategoryListQuery } from "../store/services/post.service";
import "./Rental.css";

const LIMIT = 10;

const AdCategory = ({ category, type }) => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("elk_authorization_token");

  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const [allAds, setAllAds] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const prevDataRef = useRef(null);

  const queryPayload = {
    ad_type: type,
    category: category.title,
    limit: LIMIT,
    offset,
  };

  const { data: adList, isLoading, isFetching } = useGetRentCategoryListQuery(queryPayload);

  // Accumulate posts as offset changes
  useEffect(() => {
    if (!adList) return;
    if (prevDataRef.current === adList) return;
    prevDataRef.current = adList;

    const newAds = adList?.data ?? [];
    const totalCount = adList?.totalCount ?? 0;

    setAllAds((prev) => {
      const existingIds = new Set(prev.map((a) => a.id));
      const unique = newAds.filter((a) => !existingIds.has(a.id));
      return [...prev, ...unique];
    });

    setHasMore(offset + LIMIT < totalCount);
  }, [adList]); // eslint-disable-line react-hooks/exhaustive-deps

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

  return (
    <>
      <AppHeader isChat={false} />
      <div className="main container py-4" style={{ minHeight: "80vh" }}>
        <h1 className="mb-4" style={{ textTransform: "capitalize" }}>
          {category.title}
        </h1>

        {isLoading && offset === 0 ? (
          <Loader />
        ) : allAds.length > 0 ? (
          <>
            <div className="posts-grid">
              {allAds.map((ad) => (
                <PostCard
                  key={ad.id}
                  post={ad}
                  onClick={handleCardClick}
                  isMyAd={false}
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
                You've seen all ads!
              </p>
            )}
          </>
        ) : (
          !isFetching && <EmptyState />
        )}
      </div>
      <Footer />
      <PostModal
        show={showModal}
        onHide={() => setShowModal(false)}
        post={selectedPost}
      />
    </>
  );
};

export default AdCategory;