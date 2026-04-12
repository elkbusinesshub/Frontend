// import React, { useState,useEffect } from 'react';
// import AppHeader from './AppHeader';
// import Footer from './AppFooter';
// import Loader from './Loader';
// import '../App.css'
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import PostCard from './PostCard';
// import PostModal from './PostModal';
// import EmptyState from './EmptyAd';
// import { useUserWithAdsQuery, useViewContactQuery } from '../store/services/user.service';

// const UserProfilePage = () => {
//     const token = localStorage.getItem('elk_authorization_token');
//     const [userData, setUserData] = useState();
//     const [contact, setContact] = useState()
//     const [loading, setLoading] = useState(false);
//     const { id } = useParams();
//     const [selectedPost, setSelectedPost] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const handleCardClick = (post) => {
//         setSelectedPost(post);
//         setShowModal(true);
//     };
//     useEffect(() => {
//         const fetchUserData = async () => {
//           try {
//             const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/user_with_ads`, 
//               {
//                 user_id: id
//               },
//               {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             );
//             setUserData(res.data);
//           } catch (err) {
//             console.error("Error fetching wishlist:", err);
//           } finally {
//             setLoading(false);
//           }
//         };
//         const fetchContact = async () => {
//           try {
//             const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/view_contact`, 
//               {
//                 userId: id
//               },
//               {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             );
//             setContact(res.data);
//           } catch (err) {
//             console.error("Error fetching wishlist:", err);
//           } finally {
//             setLoading(false);
//           }
//         };
//         if (token) {
//           fetchUserData();
//           fetchContact();
//         } else {
//           setLoading(false);
//         }
//       }, [token]);
//     return (
//         <>
//             <AppHeader isChat={false} />
//             <main className="container py-4" style={{ minHeight: '70vh' }}>
//                 {(
//                     loading?<Loader/>:
//                     (userData && contact)?
//                     <div className="container py-4">
//                         <div className="d-flex align-items-center border-bottom pb-4 mb-4">
//                             <img 
//                                 src={contact.data.profile ?? 'https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg'} 
//                                 alt="Profile" 
//                                 className="rounded-circle border border-primary shadow" 
//                                 height="100"
//                                 width="100"
//                                 style={{ objectFit: 'cover' }}
//                             />
//                             <div className="ms-3">
//                                 <h2 className="h4 mb-1">{contact.data.name}</h2>
//                                 <p className="text-muted mb-0">{contact.data.description}</p>
//                                 <p className="text-muted mb-0">{contact.data.email}</p>
//                                 <p className="text-muted mb-0">{contact.data.mobile_number}</p>
//                             </div>
//                         </div>
//                         <h3 className='mb-5'>{contact.data.name}'s Ads</h3>
//                         <div style={{display:'flex'}}>
//                           {userData.ads.length === 0 ? (
//                             <EmptyState />
//                           ) : (
//                             userData.ads.map((ad) => (
//                               <PostCard key={ad.id} post={ad} onClick={handleCardClick} isMyAd={true}/>
//                               // <div key={ad.id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
//                               //   <h4>{ad.title}</h4>
//                               //   <p>{ad.description}</p>
//                               //   <div>
//                               //     {ad.ad_images.map((img) => (
//                               //       <img key={img.id} src={img.image} alt="Ad" width="100" height="100" style={{ marginRight: '10px' }} />
//                               //     ))}
//                               //   </div>
//                               //   {ad.ad_price_details.map((price) => (
//                               //     <p key={price.id}>
//                               //        ₹{price.rent_price} / {price.rent_duration}
//                               //     </p>
//                               //   ))}
//                               // </div>
//                             ))
//                           )}
//                         </div>
//                     </div>:<></>
//                 )}
//             </main>
//             <Footer />
//             <PostModal isMyAd={false} show={showModal} onHide={() => setShowModal(false)} post={selectedPost} />
//         </>
//     );
// };

// export default UserProfilePage;


import React, { useState } from 'react';
import AppHeader from './AppHeader';
import Footer from './AppFooter';
import Loader from './Loader';
import '../App.css';
import { useParams } from 'react-router-dom';
import PostCard from './PostCard';
import PostModal from './PostModal';
import EmptyState from './EmptyAd';
import {
  useUserWithAdsQuery,
  useViewContactQuery,
} from '../store/services/user.service';

const UserProfilePage = () => {
  const { id } = useParams();
  const token = localStorage.getItem('elk_authorization_token');

  const {
    data: userData,
    isLoading: userLoading,
  } = useUserWithAdsQuery({user_id: id}, {
    skip: !token,
  });

  console.log("userData", userData)

  const {
    data: contact,
    isLoading: contactLoading,
  } = useViewContactQuery({userId: id}, {
    skip: !token,
  });
   console.log("contact", contact)
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const loading = userLoading || contactLoading;

  return (
    <>
      <AppHeader isChat={false} />

      <main className="container py-4" style={{ minHeight: '70vh' }}>
        {loading ? (
          <Loader />
        ) : userData && contact ? (
          <div className="container py-4">
            <div className="d-flex align-items-center border-bottom pb-4 mb-4">
              <img
                src={
                  contact?.profile ??
                  'https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg'
                }
                alt="Profile"
                className="rounded-circle border border-primary shadow"
                height="100"
                width="100"
                style={{ objectFit: 'cover' }}
              />
              <div className="ms-3">
                <h2 className="h4 mb-1">{contact?.name}</h2>
                <p className="text-muted mb-0">{contact?.description}</p>
                <p className="text-muted mb-0">{contact?.email}</p>
                <p className="text-muted mb-0">{contact?.mobile_number}</p>
              </div>
            </div>

            <h3 className="mb-5">{contact?.name}&apos;s Ads</h3>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {userData.ads?.length === 0 ? (
                <EmptyState />
              ) : (
                userData.ads?.map((ad) => (
                  <PostCard
                    key={ad.id}
                    post={ad}
                    onClick={handleCardClick}
                    isMyAd={true}
                  />
                ))
              )}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </main>

      <Footer />

      <PostModal
        isMyAd={false}
        show={showModal}
        onHide={() => setShowModal(false)}
        post={selectedPost}
      />
    </>
  );
};

export default UserProfilePage;
