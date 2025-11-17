import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
// AppHeader is rendered globally by App.js
import Footer from './Footer'; // Use Footer.jsx
import OfferForm from './OfferForm'; //

import './AdTabs.css' //
import ImageUploadForm from './ImageUploadForm'; //
import Loader from './Loader'; //
import CurrentLocationButton from './CurrentLocationSearch'; //

const PostAdForm = () => {
    const navigate = useNavigate(); //
    const [loading, setLoading] = useState(false); //
    const categories = { //
      rent: [
        { name: 'Car', image: car }, { name: 'Property', image: property },
        { name: 'Electronics', image: electronics }, { name: 'Furniture', image: furniture },
        { name: 'Bike', image: bike }, { name: 'Cloth', image: cloth },
        { name: 'Tools', image: tools }, { name: 'Helicopter', image: helicopter },
        { name: 'Other', image: others },
      ],
      service: [
        { name: 'Cleaning', image: cleaning }, { name: 'Repairing', image: repair },
        { name: 'Painting', image: painting }, { name: 'Electrician', image: electrician },
        { name: 'Carpentry', image: carpentry }, { name: 'Laundry', image: laundry },
        { name: 'Plumbing', image: plumbing }, { name: 'Salon', image: haircut },
        { name: 'Other', image: others },
      ],
    };
    const [step, setStep] = useState(undefined); // Start as undefined until checked
    const [adId, setAdId] = useState(null); //
    const [showSelectCategory, setShowSelectCategory] = useState(true); //
    const [activeTab, setActiveTab] = useState('rent'); //
    const [showSuccessModal, setShowSuccessModal] = useState(false); //


    
    const [formData, setFormData] = useState({ //
        title: '',
        description: '',
        ad_type: '',
        category: '',
        ad_prices: {}
    });

    const [imageData, setImageData] = useState([]) //
    
    const handleCategoryClick = (itemName) => { //
        setFormData((prevData) => ({
            ...prevData,
            category: itemName,
            ad_type: activeTab // Set ad_type based on the current active tab
        }));
        setShowSelectCategory(false); //
        setStep(1); // Explicitly set step 1 after category selection
    };

    const handleBack = () => { //
        if (step === 2) {
            setStep(1); //
            // Decide if you want to clear imageData: setImageData([])
        } else if (step === 3) {
            setStep(2); //
        } else if (!showSelectCategory) { // On OfferForm (step 1 after category selection)
            setShowSelectCategory(true); // Go back to category selection
            setStep(1); // Stay conceptually at step 1 (category select part)
            // Clear specific form data when going back to category selection
            setFormData(prev => ({ ...prev, title: '', description: '', category: '', ad_prices: {} })); //
            setImageData([]); // Also clear images when going back to category
        }
        // If showSelectCategory is true, handleBack does nothing
    };

    const token = localStorage.getItem('elk_authorization_token'); //

    useEffect(() => { //
        if (!token) {
            setStep(1); // If no token, start at step 1
            return;
        }
        let isMounted = true; // Flag to prevent state updates if unmounted
        const fetchAd = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/get_recent_unsaved_ad`, { //
                    headers: { 'authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                if (!isMounted) return; // Exit if component unmounted

                const ad = response.data;
                // Check if a valid unsaved ad exists
                if (ad && Object.keys(ad).length !== 0 && ad.ad_stage != null) { //
                    setStep(ad.ad_stage + 1); // Resume from the next step
                    setAdId(ad.ad_id); //
                    // Pre-fill form data from the unsaved ad
                    setFormData({ //
                        title: ad.title || '',
                        description: ad.description || '',
                        ad_type: ad.ad_type || 'rent', // Default to 'rent' if missing
                        category: ad.category || '',
                        ad_prices: ad.ad_price_details?.reduce((acc, detail) => {
                            if (detail.rent_duration && detail.rent_price != null) {
                                acc[detail.rent_duration] = detail.rent_price;
                            }
                            return acc;
                        }, {}) || {},
                    });
                    // Pre-load image URLs if available (needs ImageUploadForm update)
                    // setImageData(ad.ad_images?.map(img => img.image) || []);
                    setActiveTab(ad.ad_type || 'rent'); // Sync tab
                    setShowSelectCategory(false); // Skip category selection
                } else {
                    setStep(1); // Start fresh if no valid unsaved ad
                }
            } catch (error) {
                if (isMounted) setStep(1); // Start fresh on error
                // console.error("Error fetching unsaved ad:", error);
            }
        };
        fetchAd();
        return () => { isMounted = false; }; // Cleanup function
    }, [token]);


    const headers = { Authorization: `Bearer ${token}` }; //

    const handleAdCreate = async (data) => { //
        setLoading(true); //
        try {
            // Include adId if resuming an unsaved ad
            const payload = adId ? { ...data, ad_id: adId } : data; //
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/create_post`, //
                payload,
                { headers: { 'authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
            // If it was a new ad or resuming didn't return one, get it from response
            if (!adId && response.data.ad_id) { //
               setAdId(response.data.ad_id); //
            } else if (!response.data.success && !response.data.ad_id && !adId) {
                // Handle case where API might not return ad_id on update/resume success
                // Or if there was an actual error during creation without ad_id
                 throw new Error(response.data.message || 'Failed to save ad details');
            }
            setStep(2); // Proceed to image upload
        } catch (err) {
            alert('Failed to create ad. Please try again.');
            console.error("Ad creation error:", err.response?.data || err.message);
        } finally {
            setLoading(false); //
        }
    };

    const handleImageUpload = async (formDataInstance) => { //
        let hasFiles = false;
        if (formDataInstance.has('files')) {
           const files = formDataInstance.getAll('files');
           // Ensure at least one actual file is present, not just empty entries
           hasFiles = files.some(file => file instanceof File && file.size > 0);
        }

        // If no *new* files were selected, just move to the next step
        if (!hasFiles) {
           console.log("No new images selected/uploaded, proceeding.");
           setStep(3); //
           return;
        }

        setLoading(true); //
        try {
            // API needs to handle adding images, potentially replacing old ones if adId exists
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/upload_ad_image?ad_id=${adId}&ad_stage=2&ad_status=offline`, formDataInstance, { //
                headers: { 'authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });
            setStep(3); // Go to location step
        } catch (err) {
            alert('Image upload failed');
            console.error("Image upload error:", err.response?.data || err.message);
        } finally {
            setLoading(false); //
        }
    };

    const handleAddressSubmit = async (data) => { //
        setLoading(true); //
        try {
            const payload = {
                ad_id: adId, // Send adId to update the correct ad
                country: data.country, latitude: data.latitude, longitude: data.longitude,
                state: data.state, district: data.district ?? '', locality: data.locality ?? '', place: data.place,
                ad_stage: 3, // Mark stage as complete
                ad_status: 'online' // Set ad to online
            };
            // Use update endpoint (assuming it handles finalization)
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/update_ad_address`, payload, { headers }); //
            setShowSuccessModal(true); // Show success message
        } catch (err) {
            alert('Address update failed');
            console.error("Address update error:", err.response?.data || err.message);
        } finally {
            setLoading(false); //
        }
    };

    // Show Loader if step is still undefined (during initial fetch) or if loading state is true
    if (step === undefined || loading) { //
        return <Loader />;
    }

    return (
        <>
            <div className="container py-4" style={{ minHeight: '70vh' }}>
                {/* Step 1: Category Selection OR Offer Form */}
                {step === 1 && ( //
                    showSelectCategory ? ( //
                        <>
                            {/* Removed marginTop inline style */}
                            <h2 className="offering-title text-center">What are you offering?</h2>
                            <div className="tabs">
                                <span className={`tab ${activeTab === 'rent' ? 'active' : ''}`} onClick={() => setActiveTab('rent')}>Renting</span>
                                <span className={`tab ${activeTab === 'service' ? 'active' : ''}`} onClick={() => setActiveTab('service')}>Service</span>
                            </div>
                            <div className="categories-grid">
                                {categories[activeTab].map((item) => ( //
                                    <button key={item.name} className="category-button" onClick={() => handleCategoryClick(item.name)}>
                                        <img src={item.image} alt={item.name} className="category-icon" />
                                        <div className="label">{item.name}</div>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <OfferForm //
                            selectedItem={{ type: activeTab, name: formData.category }}
                            onBack={handleBack}
                            onSubmit={handleAdCreate} // Use the combined create/resume handler
                            formData={formData} // Pass current form data
                            setFormData={setFormData} // Allow OfferForm to update state
                        />
                    )
                )}

                {/* Step 2: Image Upload */}
                {step === 2 && ( //
                    <div className="py-4">
                        <ImageUploadForm //
                            onClose={handleBack}
                            onSubmit={handleImageUpload}
                            imageData={imageData} // Pass potentially pre-loaded images
                            setImageData={setImageData} // Allow ImageUploadForm to update state
                        />
                    </div>
                )}

                {/* Step 3: Location */}
                {step === 3 && ( //
                    <div className="py-4">
                        <CurrentLocationButton //
                            onSubmit={handleAddressSubmit}
                            onClose={handleBack}
                            // Pass initialLocation if needed: initialLocation={formData.location}
                        />
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && ( //
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>🎉 Ad Uploaded Successfully!</h2>
                        <p>Your advertisement has been posted and is now live.</p>
                        <button className="modal-button" onClick={() => navigate('/home')}>Go to Home</button>
                        {/* Navigate to /home, which contains the 'My Business' tab */}
                        <button className="modal-button" style={{ marginLeft: '10px', backgroundColor: '#6c757d' }} onClick={() => navigate('/home')}>
                            View My Ads
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default PostAdForm; //