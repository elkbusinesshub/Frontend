
import { Carousel } from 'react-bootstrap';
import { Link } from "react-router-dom";



const PostCard = ({ post, onClick, isMyAd }) => {
  return (
    // <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center" style={{maxWidth:'100%',backgroundColor:'blue'}}>
    <div
      className={
        isMyAd
          ? 'col-6 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center'
          : ''
      }
    >
      <div
        className="card shadow-sm cursor-pointer"
        onClick={() => onClick(post)}
        style={{ borderRadius: '10px', maxWidth: '250px' }}
      >
        {post.ad_images && post.ad_images.length > 0 && (
          <Carousel interval={3000} indicators={false} controls={true}>
            {post.ad_images.map((imgObj, index) => (
              <Carousel.Item key={index}>
                <img
                  src={imgObj.image}
                  alt={`${post.title} - ${index + 1}`}
                  className="d-block w-100"
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    borderRadius: '10px',
                    height: '150px',
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}
        <div className="card-body p-2 d-flex flex-column">
          <h6 className="card-title post-title">{post.title}</h6>

          <div
            className="d-flex flex-column text-truncate"
            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            {post.ad_price_details?.length > 0 && (
              <span className="card-text me-2">
                ₹{post.ad_price_details[0]?.rent_price} per{' '}
                {post.ad_price_details[0]?.rent_duration}
              </span>
            )}
            {/* <span className="card-text text-truncate">
              <i className="fa-solid fa-location-dot me-1"></i>
              {`${post.ad_location.locality ? post.ad_location.locality + ',' : ''} ${post.ad_location.place ? post.ad_location.place + ',' : ''} ${post.ad_location.district ? post.ad_location.district + ',' : ''} ${post.ad_location.state ? post.ad_location.state + ',' : ''} ${post.ad_location.country ? post.ad_location.country : ''}`}
            </span> */}
            <span className="card-text text-truncate">
              <i className="fa-solid fa-location-dot me-1"></i>
              {[
                post.ad_location.locality,
                post.ad_location.place,
                post.ad_location.district,
                post.ad_location.state,
                post.ad_location.country,
              ]
                .filter(Boolean) // ✅ removes empty strings, null, undefined
                .join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
