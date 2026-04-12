import React, { useState, useCallback, useRef } from "react";
import Carousel from "./Carousel";
import PostCard from "./PostCard";
import PostModal from "./PostModal";
import car from "../assets/home_cate_cars.png";
import property from "../assets/home_cate_properties.png";
import electronics from "../assets/home_cate_electronics.png";
import tools from "../assets/home_cate_tools.png";
import furniture from "../assets/home_cate_furniture.png";
import bike from "../assets/home_cate_bikes.png";
import clothes from "../assets/home_cate_clothes.png";
import helicopter from "../assets/home_cate_helicopter.png";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import EmptyState from "./EmptyAd";
import { useSelector } from "react-redux";
import { useRecommendedPostQuery } from "../store/services/post.service";
import "./Rental.css"

const LIMIT = 10;

const Rental = () => {
  const rentalCategories = [
    { id: 1, title: "Cars", image: car },
    { id: 2, title: "Properties", image: property },
    { id: 3, title: "Electronics", image: electronics },
    { id: 4, title: "Tools", image: tools },
    { id: 5, title: "Furnitures", image: furniture },
    { id: 6, title: "Bikes", image: bike },
    { id: 7, title: "Clothes", image: clothes },
    { id: 8, title: "Helicopters", image: helicopter },
  ];

  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const [allPosts, setAllPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const prevDataRef = useRef(null); // track previous RTK data to avoid duplicate appends

  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [location, setLocation] = useState(null);
  const [locationReady, setLocationReady] = useState(!!token); // if token, no need for location

  React.useEffect(() => {
    if (!token && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationReady(true);
        },
        (error) => {
          console.warn("Location access denied or unavailable", error);
          setLocationReady(true); // proceed even without location
        }
      );
    }
  }, [token]);

  const basePayload = React.useMemo(() => {
    if (token) return { id: user?.user_id };
    if (location) return { latitude: location.latitude, longitude: location.longitude };
    return {};
  }, [token, user?.user_id, location]);

  const queryPayload = React.useMemo(
    () => ({ ...basePayload, limit: LIMIT, offset }),
    [basePayload, offset]
  );

  const { data, isLoading, isFetching } = useRecommendedPostQuery(queryPayload, {
    skip: !locationReady, // don't fetch until we know location or token
  });
  console.log(data)

  // Accumulate posts whenever RTK returns new data
  React.useEffect(() => {
    if (!data) return;
    // Avoid processing the same response twice (RTK can re-render with same data)
    if (prevDataRef.current === data) return;
    prevDataRef.current = data;

    const newPosts = data?.data ?? [];
    const totalCount = data?.totalCount ?? 0;
    console.log(newPosts)

    setAllPosts((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const unique = newPosts.filter((p) => !existingIds.has(p.id));
      return [...prev, ...unique];
    });

    setHasMore(offset + LIMIT < totalCount);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // Intersection Observer — fires when sentinel enters viewport
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

  const handleCategoryClick = (category) => {
    console.log("handlecategoryclick",category)
    navigate(`/rental/${category.title.toLowerCase()}`);
  };

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  return (
    <div className="container" style={{ minHeight: "80vh" }}>
      <Carousel categories={rentalCategories} onCategoryClick={handleCategoryClick} />

      <h3 className="ml-5 mb-4">Recommended Posts</h3>

      {isLoading && offset === 0 ? (
        <Loader />
      ) : allPosts.length > 0 ? (
        <>
          {/* Vertical list */}
          <div
            className="posts-grid"
          >
            {allPosts.map((post) => (
              <div key={post.id}>
                <PostCard post={post} onClick={handleCardClick} isMyAd={false} />
              </div>
            ))}
          </div>

          {/* Sentinel — triggers next page load */}
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
              You've seen all posts!
            </p>
          )}
        </>
      ) : (
        !isFetching && <EmptyState />
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

export default Rental;