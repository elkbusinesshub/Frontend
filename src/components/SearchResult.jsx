import { useState, useCallback, useRef, useEffect } from "react";
import AppHeader from "./AppHeader";
import Footer from "./AppFooter";
import PostCard from "./PostCard";
import PostModal from "./PostModal";
import Loader from "./Loader";
import EmptyState from "./EmptyAd";
import { useParams } from "react-router-dom";
import "./Rental.css"
import { useSearchAdQuery } from "../store/services/post.service";

const LIMIT = 15;

const SearchResult = () => {
  const { query } = useParams();

  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const [allAds, setAllAds] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const prevDataRef = useRef(null);

  const { data: adList, isLoading, isFetching } = useSearchAdQuery(
    { keyword: query, limit: LIMIT, offset },
    { skip: !query }
  );

  // Reset when query changes
  useEffect(() => {
    setOffset(0);
    setAllAds([]);
    setHasMore(true);
    prevDataRef.current = null;
  }, [query]);

  // Accumulate posts as offset changes
  useEffect(() => {
    if (!adList) return;
    if (prevDataRef.current === adList) return;
    prevDataRef.current = adList;

    const newAds = adList?.data ?? [];
     const totalCount = adList?.total ?? 0;

    setAllAds((prev) => {
      const existingIds = new Set(prev.map((a) => a.ad_id));
      const unique = newAds.filter((a) => !existingIds.has(a.ad_id));
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
          Search result of {query}
        </h1>

        {isLoading && offset === 0 ? (
          <Loader />
        ) : allAds.length > 0 ? (
          <>
            <div className="posts-grid">
              {allAds.map((ad) => (
                <PostCard
                  key={ad.ad_id}
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
                You've seen all results!
              </p>
            )}
          </>
        ) : (
          !isFetching && <EmptyState />
        )}
      </div>
      <Footer />
      <PostModal
        isMyAd={false}
        show={showModal}
        onHide={() => setShowModal(false)}
        post={selectedPost}
      />
    </>
  );
};

export default SearchResult;