import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SSidebar from "./SuperAdminSideBar";
import AdminNav from "./SuperAdminNav";
import Loader from "../Loader";
import "../../styles/admin/EditAd.css";
import { IoCloseCircleOutline } from "react-icons/io5";
import {
  useGetAdbyIdQuery,
  useUpdateAdMutation,
} from "../../store/services/superadmin.service";

function SuperAdminEditAd() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [newImages, setNewImages] = useState([]);

  const { data, isLoading: dataLoading } = useGetAdbyIdQuery(id);
  const [updateAd, { isLoading: updating }] = useUpdateAdMutation();
  console.log("updating",data)

  // Populate local state once data is fetched
  useEffect(() => {
    if (!data) return;

    const adData = data;
    const convertedPrices =
      adData.ad_price_details?.map((price) => ({
        id: price.id,
        category: "duration",
        unit: price.rent_duration || "",
        price: price.rent_price || "",
      })) || [];

    setAd({ ...adData, ad_price_details: convertedPrices });
  }, [data]);

  // ── BASIC FIELD CHANGE ───────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAd((prev) => ({ ...prev, [name]: value }));
  };

  // ── PRICE HANDLING ───────────────────────────────────────────────
  const handlePriceChange = (index, field, value) => {
    setAd((prev) => {
      const updated = [...prev.ad_price_details];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, ad_price_details: updated };
    });
  };

  const addNewPrice = () => {
    setAd((prev) => ({
      ...prev,
      ad_price_details: [
        ...prev.ad_price_details,
        { category: "", unit: "", price: "" },
      ],
    }));
  };

  const removePrice = (index) => {
    setAd((prev) => ({
      ...prev,
      ad_price_details: prev.ad_price_details.filter((_, i) => i !== index),
    }));
  };

  // ── IMAGE HANDLING ───────────────────────────────────────────────
  const handleImageUpload = (e) => {
    setNewImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  // ── SAVE ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("id", ad.id);
      formData.append("title", ad.title);
      formData.append("description", ad.description);
      formData.append("category", ad.category);
      formData.append("ad_price_details", JSON.stringify(ad.ad_price_details));
      newImages.forEach((file) => formData.append("ad_images", file));

      await updateAd(formData).unwrap();
      alert("Ad updated successfully");
      navigate(-1);
    } catch (err) {
      alert(err?.data?.message || "Update failed");
    }
  };

  if (dataLoading || !ad ) return <Loader />;

  console.log("aadddd", ad)

  return (
    <>
      <SSidebar />
      <AdminNav />
      {updating && (
        <div className="overlay-loader">
          <Loader />
        </div>
      )}
      <div className="edit-ad-container">
        <div className="edit-card">
          <h2>Edit Advertisement</h2>

          <div className="form-grid">
            <div className="form-group full-width">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={ad.title || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                rows="4"
                value={ad.description || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ── PRICE SECTION ── */}
          <h3 className="section-title">Price Details</h3>

          {ad.ad_price_details?.map((price, index) => (
            <div key={index} className="price-box">
              <select
                value={price.category || ""}
                onChange={(e) => handlePriceChange(index, "category", e.target.value)}
                className="styled-input"
              >
                <option value="">Select Category</option>
                <option value="duration">Duration</option>
                <option value="size">Size</option>
                <option value="custom">Custom</option>
              </select>

              {price.category === "custom" && (
                <input
                  type="text"
                  placeholder="Custom Unit"
                  value={price.unit || ""}
                  onChange={(e) => handlePriceChange(index, "unit", e.target.value)}
                  className="styled-input"
                />
              )}

              {price.category === "size" && (
                <select
                  value={price.unit || ""}
                  onChange={(e) => handlePriceChange(index, "unit", e.target.value)}
                  className="styled-input"
                >
                  <option value="">Select Unit</option>
                  <option value="Inch">Inch</option>
                  <option value="Centimeter">Centimeter</option>
                </select>
              )}

              {price.category === "duration" && (
                <select
                  value={price.unit || ""}
                  onChange={(e) => handlePriceChange(index, "unit", e.target.value)}
                  className="styled-input"
                >
                  <option value="">Select Unit</option>
                  <option value="Hour">Hour</option>
                  <option value="Day">Day</option>
                  <option value="Week">Week</option>
                  <option value="Month">Month</option>
                </select>
              )}

              <input
                type="number"
                placeholder="Price"
                value={price.price || ""}
                onChange={(e) => handlePriceChange(index, "price", e.target.value)}
                className="styled-input"
              />

              <IoCloseCircleOutline
                size={48}
                color="red"
                style={{ cursor: "pointer", marginTop: "10px" }}
                onClick={() => removePrice(index)}
              />
            </div>
          ))}

          <button className="add-btn" onClick={addNewPrice}>
            + Add Price
          </button>

          {/* ── EXISTING IMAGES ── */}
          <div className="section-title">Existing Images</div>
          <div className="image-preview-grid">
            {ad.ad_images?.map((img, index) => (
              <div key={index} className="image-box">
                <img src={img.image} alt="Ad" />
              </div>
            ))}
          </div>

          {/* ── ADD NEW IMAGES ── */}
          <div className="section-title">Add More Images</div>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          <div className="new-preview">
            {newImages.map((file, index) => (
              <img key={index} src={URL.createObjectURL(file)} alt="Preview" />
            ))}
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div className="action-buttons">
            <button className="cancel-btn" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperAdminEditAd;