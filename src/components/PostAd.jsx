import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import car from "../assets/car.png";
import bike from "../assets/bike.png";
import tools from "../assets/tools.png";
import cloth from "../assets/cloth.png";
import furniture from "../assets/furniture.png";
import helicopter from "../assets/helicopter.png";
import electronics from "../assets/electronics.png";
import property from "../assets/property.png";
import others from "../assets/others.png";
import cleaning from "../assets/cleaning.png";
import carpentry from "../assets/carpentry.png";
import plumbing from "../assets/plumbing.png";
import painting from "../assets/painting.png";
import repair from "../assets/repair.png";
import haircut from "../assets/haircut.png";
import laundry from "../assets/laundry.png";
import electrician from "../assets/electrician.png";
import AppHeader from "./AppHeader";
import Footer from "./AppFooter";
import OfferForm from "./OfferForm";
import {
  useGetRecentUnsavedAdsQuery,
  useCreatePostMutation,
  useUpdateAdAddressMutation,
  useUploadAdImageMutation,
} from "../store/services/post.service";

import "./AdTabs.css";
import ImageUploadForm from "./ImageUploadForm";
import Loader from "./Loader";
import CurrentLocationButton from "./CurrentLocationSearch";
const PostAdForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const categories = {
    rent: [
      { name: "Cars", image: car },
      { name: "Properties", image: property },
      { name: "Electronics", image: electronics },
      { name: "Furnitures", image: furniture },
      { name: "Bikes", image: bike },
      { name: "Clothes", image: cloth },
      { name: "Tools", image: tools },
      { name: "Helicopters", image: helicopter },
      { name: "Others", image: others },
    ],
    service: [
      { name: "Cleaning", image: cleaning },
      { name: "Repairing", image: repair },
      { name: "Painting", image: painting },
      { name: "Electrician", image: electrician },
      { name: "Carpentry", image: carpentry },
      { name: "Laundry", image: laundry },
      { name: "Plumbing", image: plumbing },
      { name: "Salon", image: haircut },
      { name: "Others", image: others },
    ],
  };
  const [step, setStep] = useState();
  const [adId, setAdId] = useState(null);
  const [showSelectCategory, setShowSelectCategory] = useState(true);
  const [activeTab, setActiveTab] = useState("rent");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ad_type: "",
    category: "",
    ad_prices: {
      // daily: '',
      // weekly: '',
      // monthly: ''
    },
  });

  const [imageData, setImageData] = useState([]);

  const handleCategoryClick = (itemName) => {
    setFormData((prevData) => ({
      ...prevData,
      category: itemName,
    }));
    setShowSelectCategory(false);
  };
  // const handleBack = () =>{
  //     setShowSelectCategory(true);
  //     setStep(1);
  //     setFormData({
  //         title: '',
  //         description: '',
  //         ad_type: '',
  //         category: '',
  //         ad_prices: {
  //             // daily: '',
  //             // weekly: '',
  //             // monthly: ''
  //         }
  //     });
  // }
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setImageData([]);
    } else if (step === 3) {
      setStep(2);
    } else if (!showSelectCategory) {
      setShowSelectCategory(true);
      setStep(1);
      setFormData({
        title: "",
        description: "",
        ad_type: "",
        category: "",
        ad_prices: {
          // daily: '',
          // weekly: '',
          // monthly: ''
        },
      });
    }
  };

  const token = localStorage.getItem("elk_authorization_token");
  const { data: unsavedAds, isLoading: unsavedAdsLoading } =
    useGetRecentUnsavedAdsQuery({ skip: !token });
 const [createPost, {isLoading: createPostLoading}] = useCreatePostMutation();
 const [uploadImage, {isLoading: uploadImageLoading}] = useUploadAdImageMutation();
 const [updateAddresss, {isLoading: upadateAddressLoading}] = useUpdateAdAddressMutation();

  //   useEffect(() => {
  //     if (!token) return;
  //     const fetchAd = async () => {
  //       try {
  //         const response = await axios.get(
  //           `${process.env.REACT_APP_API_BASE_URL}/api/get_recent_unsaved_ad`,
  //           {
  //             headers: {
  //               authorization: `Bearer ${token}`,
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );
  //         const ad = response.data;
  //         setStep(ad && Object.keys(ad).length !== 0 ? ad.ad_stage + 1 : 1);
  //         setAdId(ad && Object.keys(ad).length !== 0 ? ad.ad_id : null);
  //       } catch (error) {
  //         //
  //       }
  //     };
  //     fetchAd();
  //   }, [token]);

//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

  useEffect(() => {
    if (unsavedAds && Object.keys(unsavedAds).length !== 0) {
      setStep(unsavedAds.ad_stage + 1);
      setAdId(unsavedAds.ad_id);
    } else {
      setStep(1);
    }
  }, [unsavedAds]);

  const handleAdCreate = async (data) => {
    setLoading(true);
    try {
    //   const response = await axios.post(
    //     `${process.env.REACT_APP_API_BASE_URL}/api/create_post`,
    //     data,
    //     {
    //       headers: {
    //         authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
      const response = await createPost(data);
      setAdId(response.data.ad_id);
      setStep(2);
    } catch (err) {
      alert("Failed to create ad");
    } 
    finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (data) => {
    setLoading(true);
    try {
      // await axios.post(
      //   `${process.env.REACT_APP_API_BASE_URL}/api/upload_ad_image?ad_id=${adId}&ad_stage=2&ad_status=offline`,
      //   data,
      //   {
      //     headers: {
      //       authorization: `Bearer ${token}`,
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );
      const res = await uploadImage({ad_id: adId, ad_stage: 2, ad_status: "offline", data});
      console.log("res...",res)
      if (!res) {
        return;
      }
      setStep(3);
    } catch (err) {
      console.error("Image upload failed: ",err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ad_id: adId,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        state: data.state,
        district: data.district ?? "",
        locality: data.locality ?? "",
        place: data.place,
        ad_stage: 3,
        ad_status: "online",
      };
    //   await axios.post(
    //     `${process.env.REACT_APP_API_BASE_URL}/api/update_ad_address`,
    //     payload,
    //     { headers }
    //   );
    let res = await updateAddresss(payload);
    if(!res){
      return;
    }

      setShowSuccessModal(true);
    } catch (err) {
      alert("Address update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader isChat={false} />
      <div className="container" style={{ minHeight: "70vh" }}>
        {loading ?? <Loader />}
        {step === 1 && (
          <div>
            {showSelectCategory ? (
              <>
                <h2
                  className="offering-title"
                  style={{ textAlign: "center", marginTop: "100px" }}
                >
                  What are you offering?
                </h2>
                <div className="tabs">
                  <span
                    className={`tab ${activeTab === "rent" ? "active" : ""}`}
                    onClick={() => setActiveTab("rent")}
                  >
                    Renting
                  </span>
                  <span
                    className={`tab ${activeTab === "service" ? "active" : ""}`}
                    onClick={() => setActiveTab("service")}
                  >
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
                      <img
                        src={item.image}
                        alt={item.name}
                        className="category-icon"
                      />
                      <div className="label">{item.name}</div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <OfferForm
                selectedItem={{ type: activeTab, name: formData.category }}
                onBack={handleBack}
                onSubmit={handleAdCreate}
                formData={formData}
                setFormData={setFormData}
              />
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <ImageUploadForm
              onClose={handleBack}
              onSubmit={handleImageUpload}
              imageData={imageData}
              setImageData={setImageData}
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <CurrentLocationButton
              onSubmit={handleAddressSubmit}
              onClose={handleBack}
            />
          </div>
        )}
      </div>
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>🎉 Post Uploaded Successfully!</h2>
            <p>Your advertisement has been posted and is now live.</p>
            <button className="modal-button" onClick={() => navigate("/home")}>
              Go to Home
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default PostAdForm;
