import SSidebar from "./SuperAdminSideBar";
import '../../styles/admin/HomeAdmin.css';
import { useState } from "react";
import AdminNav from "./SuperAdminNav";
import { Button } from "react-bootstrap";
import Loader from "../Loader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ChatIcon from '@mui/icons-material/Chat';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import dayjs from "dayjs";
import {
  useGetAdsLocationListQuery,
  useGetAdsListQuery,
  useDeleteAdMutation,
} from "../../store/services/superadmin.service";

const LIMIT = 10;

function SuperAdminHome() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sliderIndex, setSliderIndex] = useState({});
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  const { data: adsData, isLoading: adsLoading } = useGetAdsListQuery(
    { date: selectedDate, location: selectedLocation, limit: LIMIT, offset },
    { refetchOnMountOrArgChange: true }
  );
  
  const { data: locationsData, isLoading: locationsLoading } = useGetAdsLocationListQuery();
  const [deleteAdMutation] = useDeleteAdMutation();

  const ads = adsData?.data?.data ?? [];
  const total = adsData?.data?.total ?? 0;
  const currentPage = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.ceil(total / LIMIT);
  const adLocations = ["Select", "New Delhi", ...(locationsData?.data?.list ?? [])];
  const loading = adsLoading || locationsLoading;

  // Reset to first page when filters change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setOffset(0);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value === "Select" ? "" : e.target.value);
    setOffset(0);
  };

  const handlePrev = () => setOffset((prev) => Math.max(prev - LIMIT, 0));
  const handleNext = () => setOffset((prev) => prev + LIMIT);

  const handleEdit = (adId) => navigate(`/admin/edit-ad/${adId}`);

  const handleDeleteAd = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this ad?");
    if (!confirmed) return;
    try {
      await deleteAdMutation(id).unwrap();
      alert("Ad deleted successfully!");
    } catch (error) {
      alert(error?.data?.message || "Failed to delete ad.");
    }
  };

  const handleWhatsAppClick = (phone, message) => {
    if (!phone) {
      Swal.fire({ icon: "warning", title: "Phone Number Not Available", confirmButtonColor: "#3085d6" });
      return;
    }
    const phoneNumber = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const downloadExcel = () => {
    if (ads.length === 0) {
      Swal.fire({ icon: "warning", title: "No ads available to export!", confirmButtonColor: "#3085d6" });
      return;
    }
    const data = ads.map((ad, index) => ({
      "S No": offset + index + 1,
      "Ad ID": ad.ad_id,
      "Title": ad.title,
      "Category": ad.category,
      "Type": ad.ad_type,
      "Phone": ad.user?.mobile_number ?? "-",
      "Email": ad.user?.email ?? "-",
      "Status": ad.ad_status,
      "Location": ad.ad_location
        ? [ad.ad_location.place, ad.ad_location.district, ad.ad_location.state].filter(Boolean).join(", ")
        : "N/A",
      "Price": ad.ad_price_details?.[0]?.rent_price
        ? `₹${ad.ad_price_details[0].rent_price} / ${ad.ad_price_details[0].rent_duration}`
        : "N/A",
      "Posted By": ad.user?.name || "User",
      "Date": dayjs(ad.createdAt).format("MMM D, YYYY"),
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ads");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `elk_ads_report_${dayjs().format("YYYY-MM-DD")}.xlsx`);
  };

  const slideImage = (adId, direction, length) => {
    setSliderIndex((prev) => {
      const current = prev[adId] || 0;
      const newIndex =
        direction === "left"
          ? current === 0 ? length - 1 : current - 1
          : current === length - 1 ? 0 : current + 1;
      return { ...prev, [adId]: newIndex };
    });
  };

  return (
    <>
      <SSidebar />
      <AdminNav />
      <div className="homeadmin">
        <div className="filters">
          <div className="fields">
            <div className="label">Select date:</div>
            <div className="input">
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                onClick={(e) => e.target.showPicker()}
              />
            </div>
          </div>
          <div className="fields">
            <div className="label">Select Location:</div>
            <div className="input">
              <select value={selectedLocation || "Select"} onChange={handleLocationChange}>
                {adLocations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginLeft: "20px" }}>
            <h4>Total: {total}</h4>
          </div>
          <div>
            <Button variant="success" onClick={downloadExcel}>Download Excel</Button>
          </div>
        </div>

        {loading ? <Loader /> : (
          <>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>S No:</th>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Price</th>
                    {/* <th>Images</th> */}
                    <th>Posted By</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.length > 0 ? (
                    ads.map((ad, index) => (
                      <tr key={ad.ad_id}>
                        <td>{offset + index + 1}</td>
                        <td>{ad.ad_id}</td>
                        <td>{ad.title}</td>
                        <td>{ad.category}</td>
                        <td>{ad.ad_type}</td>
                        <td>{ad.user?.mobile_number ?? "-"}</td>
                        <td>{ad.user?.email ?? "-"}</td>
                        <td>{ad.ad_status}</td>
                        <td>
                          {ad.ad_location
                            ? [ad.ad_location.place, ad.ad_location.district, ad.ad_location.state]
                                .filter(Boolean).join(", ")
                            : "N/A"}
                        </td>
                        <td>
                          {ad.ad_price_details?.length > 0
                            ? ad.ad_price_details.map((p) => `₹${p.rent_price}/${p.rent_duration}`).join(", ")
                            : "N/A"}
                        </td>
                        {/* <td>
                          {ad.ad_images?.length > 0 && (
                            <div className="ad-slider">
                              <img
                                src={ad.ad_images[sliderIndex[ad.ad_id] || 0]?.image}
                                alt="Ad"
                                className="ad-card-img"
                              />
                              {ad.ad_images.length > 1 && (
                                <>
                                  <button className="nav-btn left" onClick={() => slideImage(ad.ad_id, "left", ad.ad_images.length)}>‹</button>
                                  <button className="nav-btn right" onClick={() => slideImage(ad.ad_id, "right", ad.ad_images.length)}>›</button>
                                </>
                              )}
                            </div>
                          )}
                        </td> */}
                        <td>{ad.user?.name || "User"}</td>
                        <td>{dayjs(ad.createdAt).format("MMM D, YYYY")}</td>
                        <td>
                          <Button
                            style={{ backgroundColor: "blue", color: "white", marginRight: "15px" }}
                            onClick={() => handleEdit(ad.ad_id)}
                          >
                            Edit
                          </Button>
                          <Button
                            style={{ backgroundColor: "red", color: "white" }}
                            onClick={() => handleDeleteAd(ad.ad_id)}
                          >
                            Delete
                          </Button>
                          <ChatIcon
                            onClick={() => navigate("/chat", {
                              state: {
                                userId: ad.user_id,
                                userName: ad.user.name,
                                adName: ad.title,
                                profile: ad.user.profile,
                                message: `Hey ${ad.user.name}! Your ad "${ad.title}" is almost ready to go! Just complete it to make it live.`,
                              },
                            })}
                            fontSize="large"
                            sx={{ color: "#4FBBB4", margin: "0 20px", cursor: "pointer" }}
                          />
                          <WhatsAppIcon
                            style={{ color: "green", fontSize: 30, cursor: "pointer" }}
                            onClick={() => handleWhatsAppClick(
                              ad.user?.mobile_number,
                              `Hey ${ad.user.name}! Your ad "${ad.title}" is almost ready to go! Just complete it to make it live.`
                            )}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="14" style={{ textAlign: "center" }}>No ads found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handlePrev}
                  disabled={offset === 0}
                >
                  Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SuperAdminHome;
