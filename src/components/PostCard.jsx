import { Carousel } from 'react-bootstrap';
import dayjs from 'dayjs';
import { MdDeleteForever } from "react-icons/md";

const PostCard = ({ post, onClick, isMyAd, onDeleteAd }) => {
  // Safely extract post data
  const createdAt = post?.createdAt;
  const adImages = post?.ad_images || [];
  const adPriceDetails = post?.ad_price_details?.[0];
  const adLocation = post?.ad_location;
  const postTitle = post?.title || 'Untitled Ad';

  // Format date
  const postDateTime = createdAt
    ? dayjs(createdAt).format('MMM D, YYYY [at] h:mm A')
    : 'Date not available';

  // Handle delete
  const handleDelete = (e) => {
    e.stopPropagation(); // prevent modal trigger
    if (onDeleteAd && post?.ad_id) {
      onDeleteAd(post.ad_id);
    } else {
      console.error("onDeleteAd function or post.ad_id is missing");
    }
  };

  return (
    <div
      className="card shadow-sm"
      style={{
        borderRadius: '10px',
        width: '250px',
        maxWidth: '250px',
        position: 'relative',
        marginBottom: '1rem',
        overflow: 'hidden',
      }}
    >
      {/* Red delete icon (no background, no border) */}
      {isMyAd && onDeleteAd && (
        <MdDeleteForever
          onClick={handleDelete}
          size={26}
          color="red"
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          title="Delete Ad"
        />
      )}

      {/* Carousel Section */}
      {adImages.length > 0 ? (
        <Carousel
          interval={null}
          indicators={false}
          controls={adImages.length > 1}
        >
          {adImages.map((imgObj, index) => (
            <Carousel.Item key={index}>
              <img
                src={imgObj?.image}
                alt={`${postTitle} - ${index + 1}`}
                className="d-block w-100"
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '150px',
                  cursor: 'pointer',
                }}
                onClick={() => onClick(post)}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <div
          style={{
            height: '150px',
            backgroundColor: '#e9ecef',
            cursor: 'pointer',
          }}
          onClick={() => onClick(post)}
          className="d-flex align-items-center justify-content-center text-muted small"
        >
          No Image
        </div>
      )}

      {/* Card Body */}
      <div
        className="card-body p-2 d-flex flex-column"
        style={{ cursor: 'pointer' }}
        onClick={() => onClick(post)}
      >
        <h6 className="card-title post-title mb-1">{postTitle}</h6>
        <div className="d-flex flex-column" style={{ fontSize: '0.8rem' }}>
          <span className="card-text text-truncate mb-1">
            ₹{adPriceDetails?.rent_price ?? 'N/A'} per{' '}
            {adPriceDetails?.rent_duration || 'unit'}
          </span>
          <span className="card-text text-truncate mb-1">
            <i className="fa-solid fa-location-dot me-1"></i>
            {[
              adLocation?.locality,
              adLocation?.place,
              adLocation?.district,
            ]
              .filter(Boolean)
              .join(', ') || 'Location unspecified'}
          </span>
          <span className="card-text text-muted small mt-auto">
            {postDateTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
