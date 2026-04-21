import React, { useState, useEffect } from "react";
import "./ImageUploadForm.css";

export default function ImageUploadForm({ onSubmit, onClose, imageData, setImageData }) {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const VISIBLE = 3;

  useEffect(() => {
    if (imageData && imageData.length > 0) {
      const previews = imageData.map((item) =>
        typeof item === "string" ? item : URL.createObjectURL(item)
      );
      setImages(imageData);
      setPreviewUrls(previews);
    }
  }, [imageData]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const previews = files.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...files]);
      setPreviewUrls((prev) => [...prev, ...previews]);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviewUrls(updatedPreviews);
    setImageData(updatedImages);
    if (currentIndex > 0 && currentIndex >= updatedPreviews.length - VISIBLE + 1) {
      setCurrentIndex(Math.max(0, updatedPreviews.length - VISIBLE));
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(previewUrls.length - VISIBLE, prev + 1)
    );
  };

  const handleUpload = (event) => {
    event.preventDefault();
    const formData = new FormData();
    images.forEach((item) => {
      if (item instanceof File) {
        formData.append("files", item);
      }
    });
    setImageData(images);
    onSubmit(formData);
  };

  const handleSkip = () => {
    const emptyFormData = new FormData();
    onSubmit(emptyFormData);
  };

  const showPrev = currentIndex > 0;
  const showNext = previewUrls.length > VISIBLE && currentIndex < previewUrls.length - VISIBLE;

  return (
    <form className="image-upload-form" onSubmit={handleUpload}>
      <div className="form-group">
        <label htmlFor="imageUpload">Upload Images</label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
      </div>

      {previewUrls.length > 0 && (
        <div className="carousel-wrapper">
          {showPrev && (
            <button type="button" className="carousel-btn left" onClick={handlePrev}>
              ‹
            </button>
          )}

          <div className="carousel-track">
            {previewUrls.slice(currentIndex, currentIndex + VISIBLE).map((url, i) => {
              const actualIndex = currentIndex + i;
              return (
                <div key={actualIndex} className="preview-container">
                  <img src={url} alt={`Preview ${actualIndex + 1}`} className="preview-image" />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveImage(actualIndex)}
                  >
                    ✖
                  </button>
                </div>
              );
            })}
          </div>

          {showNext && (
            <button type="button" className="carousel-btn right" onClick={handleNext}>
              ›
            </button>
          )}
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Back
        </button>
        <button type="submit" className="btn-submit" disabled={images.length === 0}>
          Upload
        </button>
        <button type="button" className="btn-skip" onClick={handleSkip}>
          Skip
        </button>
      </div>
    </form>
  );
}