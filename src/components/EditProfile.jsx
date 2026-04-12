import { useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { auth, provider, signInWithPopup } from '../firebase'
import { Button, Modal } from 'react-bootstrap'
import './EditProfile.css'
import { setUser, updateUser } from '../store/slices/authSlice'
import {
  useUpdateProfilePicMutation,
  useUpdateProfileMutation,
  useSendOtpMutation,
  useCreateUserMutation,
  useVerifyUpdateMobileMutation,
  useUpdateMobileEmailMutation,
} from '../store/services/user.service'
import { errorMessageToast, successMessageToast } from './common/hooks/common'

const EditProfile = ({ user, onClose, onProfileUpdated, token, show }) => {
  const [updateProfilePic, { isLoading: updateProfilePicLoading }] =
    useUpdateProfilePicMutation()
  const [updateProfile, { isLoading: updateProfileLoading }] =
    useUpdateProfileMutation()
  const [sendOtp, { isLoading: sendOtpLoading }] = useSendOtpMutation()
  const [createUser, { isLoading: createUserLoading }] = useCreateUserMutation()
  const [verifyMobile, { isLoading: verifyMobileLoading }] =
    useVerifyUpdateMobileMutation()
  const [updateMobileEmail, { isLoading: updateMobileEmailLoading }] =
    useUpdateMobileEmailMutation()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('profilePic')

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    description: user.description || '',
    email: user.email || '',
    mobile: user.mobile_number || '',
    profile: user.profile || null,
    otp: '',
    verificationId: '',
  })
  const [otpSent, setOtpSent] = useState(false)

  const [previewImage, setPreviewImage] = useState(user.profile || null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, profile: file })
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)
    }
  }
  const handleProfilePicUpload = async () => {
    // setLoading(true);
    try {
      const form = new FormData()
      form.append('file', formData.profile)
      // await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/update_profile_pic?id=${user.user_id}`,
      //     form,
      //     {
      //         headers: {
      //             Authorization: `Bearer ${token}`,
      //         },
      //     }
      // )
      const response = await updateProfilePic({
        id: user.user_id,
        payload: form,
      })
      // alert("Profile picture updated");
      // set Loading(false);
      console.log("res,,",response)
      successMessageToast(response?.message)
      dispatch(updateUser({ profile: response?.data }))
      onClose()
      onProfileUpdated()
    } catch (error) {
      console.log('Error while updating profile pic: ', error)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      //   setLoading(true);
      //   await axios.post(
      //     `${process.env.REACT_APP_API_BASE_URL}/api/update_profile`,
      //     {
      //       user_id: user.user_id,
      //       name: formData.name,
      //       description: formData.description,
      //     },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   );
      const res = await updateProfile({
        user_id: user.user_id,
        name: formData.name,
        description: formData.description,
      })
      successMessageToast(res?.message)
      dispatch(
        updateUser({ name: formData.name, description: formData.description }),
      )
      //   alert("Name & description updated");
      //   setLoading(false);
      onClose()
      onProfileUpdated()
    } catch (err) {
      console.log('Error while updating profile: ', err)
    }
  }

  const validatePhoneNumber = (number) => /^[0-9]{10}$/.test(number)

  const handleSendOtp = async () => {
    if (!validatePhoneNumber(formData.mobile)) {
      errorMessageToast('Please enter a valid 10-digit phone number.')
      return
    }
    try {
      //   setLoading(true);
      //   const res = await axios.post(
      //     `${process.env.REACT_APP_API_BASE_URL}/api/send_otp`,
      //     {
      //       mobile: formData.mobile,
      //     },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   );
      const res = await sendOtp({
        mobile: formData.mobile,
      })
      successMessageToast('OTP sent to your number')
      setFormData({
        ...formData,
        verificationId: res.data.verificationId,
      })
      //   setLoading(false);
      setOtpSent(true)
      // onClose();
      onProfileUpdated()
    } catch (err) {
      //   setLoading(false);
      // alert("Failed to send OTP");
      console.log('Error in sending the otp:  ', err)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      //   setLoading(true);
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const name = user.displayName
      const email = user.email
      const uuid = user.uid
      //   const response = await axios.post(
      //     `${process.env.REACT_APP_API_BASE_URL}/api/create_user`,
      //     {
      //       name,
      //       uuid,
      //       email,
      //     }
      //   );
      const response = await createUser({
        name,
        uuid,
        email,
      })
      //   localStorage.setItem("elk_authorization_token", response.data.data.token);
      // localStorage.setItem('elk_is_admin', response.data.data.is_admin);
      // localStorage.setItem('elk_user_id', response.data.data.user_id);
      dispatch(
        setUser({
          user: response.data.data,
          token: response.data.data.token,
          isAdmin: response.data.data.is_admin,
        }),
      )
      //   alert("Email updated");
      successMessageToast(response?.message)
      //   setLoading(false);
      onClose()
      onProfileUpdated()
    } catch (error) {
      //   setLoading(false);
      console.log('Google Login Error:', error)
    }
  }


  const handleVerifyOtp = async () => {
    try {
      //   setLoading(true);
      //   await axios
      //     .post(
      //       `${process.env.REACT_APP_API_BASE_URL}/api/verify_update_mobile`,
      //       {
      //         verificationId: formData.verificationId,
      //         otp: formData.otp,
      //       },
      //       {
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //         },
      //       }
      //     )
      //     .then(async (res) => {
      //       await axios.post(
      //         `${process.env.REACT_APP_API_BASE_URL}/api/update_email_or_mobile`,
      //         {
      //           user_id: user.user_id,
      //           mobile: formData.mobile,
      //         },
      //         {
      //           headers: {
      //             Authorization: `Bearer ${token}`,
      //           },
      //         }
      //       );
      //     });
      await verifyMobile({
        verificationId: formData.verificationId,
        otp: formData.otp,
      }).unwrap()
      await updateMobileEmail({
        user_id: user.user_id,
        mobile: formData.mobile,
      }).unwrap()
      setFormData({ ...formData, otp: '', verificationId: '' })
      successMessageToast('Mobile number verified')
      //   setLoading(false);
      setOtpSent(false)
      onClose()
      onProfileUpdated()
    } catch (err) {
      console.log('Invalid OTP')
    }
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'profilePic':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={
                previewImage ||
                'https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg'
              }
              alt="Profile"
              className="rounded-circle border border-primary shadow"
              height="100"
              width="100"
              style={{ objectFit: 'cover', marginBottom: '20px' }}
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="form-control mb-3"
            />
            <button
              className="btn btn-warning btn-sm"
              style={{ color: 'white' }}
              onClick={handleProfilePicUpload}
              disabled={updateProfilePicLoading}
            >
              Upload
            </button>
          </div>
        )
      case 'profileInfo':
        const isValid =
          formData.name.trim() !== '' && formData.description.trim().length > 3
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="form-control mb-2"
              placeholder="Name"
            />
            {formData.name.trim() === '' && (
              <small className="text-danger mb-2">
                Name should not be empty.
              </small>
            )}
            <input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="form-control mb-2"
              placeholder="Description"
            />
            {formData.description.trim().length > 0 &&
              formData.description.trim().length <= 3 && (
                <small className="text-danger mb-2">
                  Description must be longer than 3 characters.
                </small>
              )}
            <button
              className="btn btn-warning btn-sm"
              style={{ color: 'white' }}
              onClick={handleProfileUpdate}
              disabled={!isValid || updateProfileLoading}
            >
              Update
            </button>
          </div>
        )
      case 'email':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="text-center mt-3">
              <Button
                variant="outline-primary"
                className="w-100 py-2 btn-sm "
                onClick={handleGoogleLogin}
                disabled={createUserLoading}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  style={{ width: 20, marginRight: 10 }}
                />
                Continue with Google
              </Button>
            </div>
          </div>
        )
      case 'mobile':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!otpSent ? (
              <>
                <input
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  className="form-control mb-2"
                  placeholder="Mobile Number"
                />
                <button
                  className="btn btn-warning btn-sm"
                  style={{ color: 'white' }}
                  onClick={handleSendOtp}
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <input
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({ ...formData, otp: e.target.value })
                  }
                  className="form-control mb-2"
                  placeholder="Enter OTP"
                />
                <button
                  className="btn btn-success btn-sm"
                  style={{ color: 'white' }}
                  onClick={handleVerifyOtp}
                  disabled={verifyMobileLoading || updateMobileEmailLoading}
                >
                  Verify OTP
                </button>
              </>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="p-4 edit-profile-modal">
          <div
            className="d-flex gap-2 mb-4 flex-wrap"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <button
              style={{
                color: activeTab === 'profilePic' ? 'white' : '#FFDA3F',
              }}
              className={`btn ${
                activeTab === 'profilePic'
                  ? 'btn-warning'
                  : 'btn-outline-warning'
              } custom-tab-button btn-sm`}
              onClick={() => setActiveTab('profilePic')}
            >
              Profile Picture
            </button>
            <button
              style={{
                color: activeTab === 'profileInfo' ? 'white' : '#FFDA3F',
              }}
              className={`btn ${
                activeTab === 'profileInfo'
                  ? 'btn-warning'
                  : 'btn-outline-warning'
              } custom-tab-button btn-sm`}
              onClick={() => setActiveTab('profileInfo')}
            >
              Name & Description
            </button>
            <button
              style={{ color: activeTab === 'email' ? 'white' : '#FFDA3F' }}
              className={`btn ${
                activeTab === 'email' ? 'btn-warning' : 'btn-outline-warning'
              } custom-tab-button btn-sm`}
              onClick={() => setActiveTab('email')}
            >
              Update Email
            </button>
            <button
              style={{ color: activeTab === 'mobile' ? 'white' : '#FFDA3F' }}
              className={`btn ${
                activeTab === 'mobile' ? 'btn-warning' : 'btn-outline-warning'
              } custom-tab-button btn-sm`}
              onClick={() => setActiveTab('mobile')}
            >
              Update Mobile
            </button>
          </div>
          {renderTab()}
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default EditProfile
