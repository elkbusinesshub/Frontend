import Sidebar from "./SideBar";
import '../../styles/admin/HomeAdmin.css';
import { useState } from "react";
import Loader from "../Loader";
import { useGetSalesAdsListQuery } from "../../store/services/admin.service";
import dayjs from "dayjs";

const LIMIT = 10;

function AdminHome() {
    const [offset, setOffset] = useState(0);
    const [sliderIndex, setSliderIndex] = useState({});

    const { data: adsData, isLoading: adsDataLoading } = useGetSalesAdsListQuery(
        { limit: LIMIT, offset }
    );

    const ads = adsData?.data ?? [];
    const total = adsData?.total ?? 0;
    const currentPage = Math.floor(offset / LIMIT) + 1;
    const totalPages = Math.ceil(total / LIMIT);

    const handlePrev = () => setOffset((prev) => Math.max(prev - LIMIT, 0));
    const handleNext = () => setOffset((prev) => prev + LIMIT);

    return (
        <>
            <Sidebar />
            <div className="homeadmin">
                <div className="filters">
                    <h4>Total: {total}</h4>
                </div>

                {adsDataLoading ? (
                    <Loader />
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="admin-table-container d-none d-md-block">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>S No:</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Type</th>
                                        <th>Location</th>
                                        <th>Price</th>
                                        <th>Image</th>
                                        <th>Posted By</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ads.length > 0 ? (
                                        ads.map((ad, index) => (
                                            <tr key={ad.id}>
                                                <td>{offset + index + 1}</td>
                                                <td>{ad.title}</td>
                                                <td>{ad.category}</td>
                                                <td>{ad.ad_type}</td>
                                                <td>
                                                    {ad.ad_location
                                                        ? `${ad.ad_location.place ? ad.ad_location.place + ", " : ""}${ad.ad_location.state ?? ""}`
                                                        : "N/A"}
                                                </td>
                                                <td>
                                                    {ad.ad_price_details?.length > 0
                                                        ? ad.ad_price_details.map((p) => `₹${p.rent_price}/${p.rent_duration}`).join(", ")
                                                        : "N/A"}
                                                </td>
                                                <td>
                                                    {ad.ad_images?.length > 0 && (
                                                        <div className="ad-slider">
                                                            <img
                                                                src={ad.ad_images[sliderIndex[ad.id] || 0]?.image}
                                                                alt="Ad"
                                                                className="ad-card-img"
                                                            />
                                                            {ad.ad_images.length > 1 && (
                                                                <>
                                                                    <button
                                                                        className="nav-btn left"
                                                                        onClick={() =>
                                                                            setSliderIndex((prev) => {
                                                                                const current = prev[ad.id] || 0;
                                                                                return { ...prev, [ad.id]: current === 0 ? ad.ad_images.length - 1 : current - 1 };
                                                                            })
                                                                        }
                                                                    >‹</button>
                                                                    <button
                                                                        className="nav-btn right"
                                                                        onClick={() =>
                                                                            setSliderIndex((prev) => {
                                                                                const current = prev[ad.id] || 0;
                                                                                return { ...prev, [ad.id]: current === ad.ad_images.length - 1 ? 0 : current + 1 };
                                                                            })
                                                                        }
                                                                    >›</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>{ad.user?.name || "User"}</td>
                                                <td>{dayjs(ad.createdAt).format("MMM D, YYYY")}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: "center" }}>No ads found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="d-block d-md-none">
                            {ads.length > 0 ? (
                                ads.map((ad, index) => (
                                    <div key={ad.id} className="ad-card">
                                        <div className="ad-card-header">
                                            <strong>{offset + index + 1}. {ad.title}</strong>
                                        </div>
                                        <div className="ad-card-body">
                                            {ad.ad_images?.length > 0 && (
                                                <div className="ad-slider">
                                                    <img
                                                        src={ad.ad_images[sliderIndex[ad.id] || 0]?.image}
                                                        alt="Ad"
                                                        className="ad-card-img"
                                                    />
                                                    {ad.ad_images.length > 1 && (
                                                        <>
                                                            <button
                                                                className="nav-btn left"
                                                                onClick={() =>
                                                                    setSliderIndex((prev) => {
                                                                        const current = prev[ad.id] || 0;
                                                                        return { ...prev, [ad.id]: current === 0 ? ad.ad_images.length - 1 : current - 1 };
                                                                    })
                                                                }
                                                            >‹</button>
                                                            <button
                                                                className="nav-btn right"
                                                                onClick={() =>
                                                                    setSliderIndex((prev) => {
                                                                        const current = prev[ad.id] || 0;
                                                                        return { ...prev, [ad.id]: current === ad.ad_images.length - 1 ? 0 : current + 1 };
                                                                    })
                                                                }
                                                            >›</button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            <p><b>Category:</b> {ad.category}</p>
                                            <p><b>Type:</b> {ad.ad_type}</p>
                                            <p>
                                                <b>Location:</b>{" "}
                                                {ad.ad_location
                                                    ? `${ad.ad_location.place ? ad.ad_location.place + ", " : ""}${ad.ad_location.state ?? ""}`
                                                    : "N/A"}
                                            </p>
                                            <p>
                                                <b>Price:</b>{" "}
                                                {ad.ad_price_details?.length > 0
                                                    ? ad.ad_price_details.map((p) => `₹${p.rent_price}/${p.rent_duration}`).join(", ")
                                                    : "N/A"}
                                            </p>
                                            <p><b>Posted By:</b> {ad.user?.name || "User"}</p>
                                            <p><b>Date:</b> {dayjs(ad.createdAt).format("MMM D, YYYY")}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: "center" }}>No ads found</p>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={handlePrev}
                                    disabled={offset === 0}
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={handleNext}
                                    disabled={currentPage >= totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default AdminHome;
