import React, { useState, useEffect } from "react";
import { MdClose, MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import "./PostModal.css"; // Using the CSS you provided

const FullscreenImageView = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    const handleKeyDown = (e) => {
      
      if (images.length > 1) {
        if (e.key === "ArrowRight") goToNext();
        else if (e.key === "ArrowLeft") goToPrevious();
      }
      
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, onClose]); 

  const goToPrevious = () => {
    
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    // This function is only called if images.length > 1
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!Array.isArray(images) || images.length === 0) {
    console.error("FullscreenImageView: Invalid or empty images array provided.");
    onClose();
    return null;
  }

  return (
    <div className="fullscreen-image-view" onClick={onClose}>
      {/* Close Button (Always visible) */}
      <button
        className="close-button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
      >
        <MdClose size={28} />
      </button>

      {/* --- FIX: Conditionally Render Prev/Next Buttons --- */}
      {images.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            className="nav-button prev-button"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous"
          >
            <MdNavigateBefore size={40} />
          </button>

          {/* Next Button */}
          <button
            className="nav-button next-button"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next"
          >
            <MdNavigateNext size={40} />
          </button>
        </>
      )}
      {/* --- End Fix --- */}


      {/* Image (Always visible) */}
      <div
        className="fullscreen-image-container"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
      >
        <img
          src={images[currentIndex]}
          alt={`Fullscreen ${currentIndex + 1}`}
          className="fullscreen-image"
        />
      </div>

    </div>
  );
};

export default FullscreenImageView;