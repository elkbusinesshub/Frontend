import React from "react";
import Carousel from "./Carousel";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import cleaning from "../assets/ic_cleaning_service.png";
import repairing from "../assets/ic_repairing_service.png";
import painting from "../assets/ic_painting_service.png";
import plumbing from "../assets/ic_plumbing_service.png";
import electricain from "../assets/ic_electrician_service.png";
import carpentry from "../assets/ic_carpentry_service.png";
import laundry from "../assets/ic_laudery_service.png";
import salon from "../assets/ic_saloon_service.png";
import PostCard from "./PostCard";
import PostModal from "./PostModal";
// import { useCookies } from "react-cookie";
import axios from "axios";
import Loader from "./Loader";
import EmptyState from "./EmptyAd";
import {
  useRentCategoryPostQuery,
  useBestServiceProviderQuery,
} from "../store/services/post.service";
import "./Rental.css";



const LIMIT = 10;

const Service = () => {
  const serviceCategories = [
    { id: 1, title: "Cleaning", image: cleaning },
    { id: 2, title: "Repairing", image: repairing },
    { id: 3, title: "Painting", image: painting },
    { id: 4, title: "Plumbing", image: plumbing },
    { id: 5, title: "Electrician", image: electricain },
    { id: 6, title: "Carpentry", image: carpentry },
    { id: 7, title: "Laundry", image: laundry },
    { id: 8, title: "Salon", image: salon },
  ];

  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  // --- Infinite scroll state ---
  const [offset, setOffset] = useState(0);
  const [allProviders, setAllProviders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const prevDataRef = useRef(null);

  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Best providers query with offset/limit
  const bestProvidersPayload = React.useMemo(
    () =>
      token
        ? { user_id: user?.user_id, limit: LIMIT, offset }
        : { limit: LIMIT, offset },
    [token, user?.user_id, offset]
  );

  const { data: bestProvidersData, isLoading: bestLoading, isFetching: bestFetching } =
    useBestServiceProviderQuery(bestProvidersPayload);

  // Accumulate best providers
  React.useEffect(() => {
    if (!bestProvidersData) return;
    if (prevDataRef.current === bestProvidersData) return;
    prevDataRef.current = bestProvidersData;

    const newProviders = bestProvidersData?.data ?? [];
    const totalCount = bestProvidersData?.totalCount ?? 0;

    setAllProviders((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const unique = newProviders.filter((p) => !existingIds.has(p.id));
      return [...prev, ...unique];
    });

    setHasMore(offset + LIMIT < totalCount);
  }, [bestProvidersData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Intersection Observer sentinel
  const sentinelRef = useCallback(
    (node) => {
      if (bestFetching) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !bestFetching) {
          setOffset((prev) => prev + LIMIT);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [bestFetching, hasMore]
  );

  // Category horizontal scroll queries (unchanged)
  const { data: cleaningData } = useRentCategoryPostQuery({ ad_type: "service", category: "cleaning" });
  const { data: electricianData } = useRentCategoryPostQuery({ ad_type: "service", category: "electrician" });
  const { data: carpentryData } = useRentCategoryPostQuery({ ad_type: "service", category: "carpentry" });
  const { data: paintingData } = useRentCategoryPostQuery({ ad_type: "service", category: "painting" });

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  return (
    <div className="container p-4" style={{ minHeight: "80vh" }}>
      <Carousel
        categories={serviceCategories}
        onCategoryClick={(c) => navigate(`/services/${c.title.toLowerCase()}`)}
      />

      {/* ── Best Service Providers (infinite scroll grid) ── */}
      <h3 className="ml-5 mb-4">Best Service Providers</h3>

      {bestLoading && offset === 0 ? (
        <Loader />
      ) : allProviders.length > 0 ? (
        <>
          <div className="posts-grid">
            {allProviders.map((post) => (
              <div key={post.id}>
                <PostCard post={post} onClick={handleCardClick} isMyAd={false} />
              </div>
            ))}
          </div>

          {/* Sentinel */}
          {hasMore && <div ref={sentinelRef} style={{ height: "1px" }} />}

          {/* Loading spinner for page 2+ */}
          {bestFetching && offset > 0 && (
            <div style={{ textAlign: "center", padding: "1rem" }}>
              <Loader />
            </div>
          )}

          {!hasMore && (
            <p style={{ textAlign: "center", color: "#888", padding: "1.5rem 0" }}>
              You've seen all providers!
            </p>
          )}
        </>
      ) : (
        !bestFetching && <EmptyState />
      )}


      <PostModal
        isMyAd={false}
        show={showModal}
        onHide={() => setShowModal(false)}
        post={selectedPost}
      />
    </div>
  );
};


export default Service;
