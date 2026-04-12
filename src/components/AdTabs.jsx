import React, { useState } from 'react';
import car from '../assets/car.png';
import bike from '../assets/bike.png';
import tools from '../assets/tools.png';
import cloth from '../assets/cloth.png';
import furniture from '../assets/furniture.png';
import helicopter from '../assets/helicopter.png';
import electronics from '../assets/electronics.png';
import property from '../assets/property.png';
import others from '../assets/others.png';
import cleaning from '../assets/cleaning.png';
import carpentry from '../assets/carpentry.png';
import plumbing from '../assets/plumbing.png';
import painting from '../assets/painting.png';
import repair from '../assets/repair.png';
import haircut from '../assets/haircut.png';
import laundry from '../assets/laundry.png';
import electrician from '../assets/electrician.png';
import OfferForm from './OfferForm';
import ImageUploadForm from './ImageUploadForm'
import { useSelector } from 'react-redux';
// import axios from 'axios';
import { useCreatePostMutation } from '../store/services/post.service';

import './AdTabs.css';

const categories = {
  rent: [
    { name: 'Car', image: car },
    { name: 'Property', image: property },
    { name: 'Electronics', image: electronics },
    { name: 'Furniture', image: furniture },
    { name: 'Bike', image: bike },
    { name: 'Cloth', image: cloth },
    { name: 'Tools', image: tools },
    { name: 'Helicopter', image: helicopter },
    { name: 'Other', image: others },
  ],
  service: [
    { name: 'Cleaning', image: cleaning },
    { name: 'Repairing', image: repair },
    { name: 'Painting', image: painting },
    { name: 'Electrician', image: electrician },
    { name: 'Carpentry', image: carpentry },
    { name: 'Laundry', image: laundry },
    { name: 'Plumbing', image: plumbing },
    { name: 'Salon', image: haircut },
    { name: 'Other', image: others },
  ],
};

export default function AdTabs() {
  const [activeTab, setActiveTab] = useState('rent');
  const [selectedItem, setSelectedItem] = useState(null); 
  const {token} = useSelector(state => state.auth);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [ createPost, {isLoading: createPostLoading}] = useCreatePostMutation();

  const handleCategoryClick = (itemName) => {
    setSelectedItem({ type: activeTab, name: itemName });
  };

  const handleFormSubmit = async (formData) => {
    try {
        // const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/create_post`, formData, {
        //     headers: {
        //         'authorization': `Bearer ${token}`,
        //         'Content-Type': 'application/json'
        //     }
        // });
        const response = createPost(formData);
        const adId = response.data.ad_id;
        setCurrentPostId(adId);
        setShowImageUploadModal(true);
    } catch (error) {
        console.error('Error submitting form:', error.response?.data || error.message);
        alert('Failed to save Post. Please try again.');
    }
  };

  return (
    <div className="offering-container">
      {showImageUploadModal && currentPostId ? (
        <>
        <div className="modal-overlay" onClick={() => setShowImageUploadModal(false)} />
        <ImageUploadForm postId={currentPostId} onClose={() => setShowImageUploadModal(false)} />
          </>
      ) : selectedItem ? (
        <OfferForm
          selectedItem={selectedItem}
          onBack={() => setSelectedItem(null)}
          onSubmit={handleFormSubmit}
        />
      ) : (
        <>
          <h2 className="offering-title">What are you offering?</h2>
          <div className="tabs">
            <span className={`tab ${activeTab === 'rent' ? 'active' : ''}`} onClick={() => setActiveTab('rent')}>
              rent
            </span>
            <span className={`tab ${activeTab === 'service' ? 'active' : ''}`} onClick={() => setActiveTab('service')}>
              Service
            </span>
          </div>

          <div className="categories-grid">
            {categories[activeTab].map((item) => (
              <button
                key={item.name}
                className="category-button"
                onClick={() => handleCategoryClick(item.name)}
              >
                <img src={item.image} alt={item.name} className="category-icon" />
                <div className="label">{item.name}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

