import React, { useState } from "react";

import PostCard from "./PostCard";
import PostModal from "./PostModal";
import Loader from "./Loader";
import { useSelector } from 'react-redux';
import EmptyState from "./EmptyAd";
import NotLoggedIn from "./NotLoggedIn";
import Footer from "./Footer";
import { useDeleteAdMutation, useGetMyAdsQuery } from "../store/api/apiSlice"; 
const MyBusiness = () => {
    const { isAuthenticated } = useSelector(state => state.auth);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const {
        data: myAds = [], 
        isLoading: isLoadingAds, 
        isFetching: isFetchingAds,
    } = useGetMyAdsQuery();

    const [deleteAd, { isLoading: isDeleting }] = useDeleteAdMutation();

    const handleCardClick = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    const handleDeleteAd = async (adId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this ad?");
        if (!confirmDelete) return;

        try {
           
            await deleteAd(adId).unwrap();
            setShowModal(false); 
            alert("Ad deleted successfully.");
        } catch (err) {
            console.error("Error deleting ad:", err);
            alert("Failed to delete ad. Please try again.");
        }
    };

    const isLoading = isLoadingAds || isFetchingAds || isDeleting;

    return (
        <>
            <div className="main container py-4" style={{ minHeight: "80vh" }}>
                <h1 className="mb-4">My Ads</h1>
                {isLoading ? ( 
                    <Loader />
                ) : !isAuthenticated ? (
                    <div className="d-flex flex-column justify-content-center align-items-center p-5">
                        <NotLoggedIn />
                    </div>
                ) : myAds.length === 0 ? ( 
                    <EmptyState />
                ) : (
                    <div className="row">
                        {myAds.map((ad) => ( 
                            <PostCard
                                key={ad.id || ad.ad_id}
                                post={ad}
                                onClick={handleCardClick}
                                isMyAd={true}
                            />
                        ))}
                    </div>
                )}
            </div>
            
            <PostModal
                show={showModal}
                isMyAd={true}
                onHide={() => setShowModal(false)}
                post={selectedPost}
                onDeleteAd={handleDeleteAd} 
            />
            <Footer />
        </>
    );
}

export default MyBusiness;