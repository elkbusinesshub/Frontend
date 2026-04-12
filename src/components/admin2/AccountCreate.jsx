import React, { useState } from 'react'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import './create.css'
import Sidebar from './SideBar'
import { useGetPlaceSearchQuery, useGetPlaceMutation } from '../../store/services/place.service'
import { useCreateAdMutation } from '../../store/services/admin.service'
import { successMessageToast } from '../common/hooks/common'

const categories = {
  rent: ['Cars', 'Properties', 'Electronics', 'Furnitures', 'Bikes', 'Clothes', 'Tools', 'Others'],
  service: ['Cleaning', 'Repairing', 'Plumbing', 'Electrician', 'Carpentry', 'Laundry', 'Saloon', 'Others'],
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, '10 digit phone')
    .required('Phone required'),
  location: Yup.object({
    place: Yup.string().required('Location required'),
  }),
  ads: Yup.array()
    .of(
      Yup.object({
        type: Yup.string().required('Type required'),
        category: Yup.string().required('Category required'),
        title: Yup.string().required('Title required'),
        description: Yup.string().required('Description required'),
        prices: Yup.array()
          .of(
            Yup.object().shape({
              category: Yup.string().nullable(),
              unit: Yup.string().nullable(),
              price: Yup.number()
                .nullable()
                .transform((value, originalValue) =>
                  originalValue === '' ? null : value,
                )
                .positive('Must be positive'),
            }),
          )
          .nullable(),
      }),
    )
    .min(1, 'Add at least one ad'),
})

export default function AccountCreateMobile() {
  const navigate = useNavigate()
  const [locationLoading, setLocationLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [showLocationSearch, setShowLocationSearch] = useState(false)

  const [getPlace] = useGetPlaceMutation()
  const [createAd] = useCreateAdMutation()

  const { data: locations = [] } = useGetPlaceSearchQuery(
    { query, limited: false },
    { skip: !query }
  )

  const initialValues = {
    name: '',
    phone: '',
    location: { place: '', latitude: '', longitude: '' },
    ads: [],
  }

  const handleLocationChange = (e) => {
    setQuery(e.target.value)
    setShowLocationSearch(true)
  }

  const handleSelectLocation = (loc, setFieldValue) => {
    setFieldValue('location', loc)
    setQuery(loc.name)
    setShowLocationSearch(false)
  }

  const handleUseCurrentLocation = (setFieldValue) => {
    setLocationLoading(true)
    setShowLocationSearch(false)  // ✅ close dropdown
    setQuery('') 
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await getPlace({ latitude, longitude })
          setFieldValue('location', res.data)
          setQuery(res.data?.place || '')   // show in input box too
        } catch (err) {
          alert('Location fetch failed')
        } finally {
          setLocationLoading(false)
        }
      },
      () => {
        alert('Permission denied')
        setLocationLoading(false)
      },
    )
  }

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('phone', values.phone)
      formData.append('location', JSON.stringify(values.location))

      const adsPayload = values.ads.map((ad, adIndex) => {
        ad.images?.forEach((file) => {
          formData.append(`ads[${adIndex}][images]`, file)
        })
        return {
          type: ad.type,
          category: ad.category,
          title: ad.title,
          description: ad.description,
          prices: Array.isArray(ad.prices) ? ad.prices : [],
        }
      })

      formData.append('ads', JSON.stringify(adsPayload))

      const res = await createAd(formData)
      if (res?.data?.success) {
        successMessageToast(res.data.message ?? 'Submitted successfully')
        navigate('/sales')
      }
    } catch (err) {
      console.log('Submit failed: ' + err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Sidebar />
      <br />
      <div className="mobile-container">
        <div className="header">Create Account</div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <>
              {isSubmitting && (
                <div className="fullscreen-loader">
                  <div className="loader-box">
                    <div className="spinner-border text-primary"></div>
                    <p>Submitting...</p>
                  </div>
                </div>
              )}

              <Form>
                <div className="card-box">
                  <h5>Profile Details</h5>

                  <Field name="name" placeholder="Name" className="styled-input" />
                  <ErrorMessage name="name" component="div" className="error-text" />

                  <Field name="phone" placeholder="Phone" className="styled-input" />
                  <ErrorMessage name="phone" component="div" className="error-text" />

                  {/* LOCATION - Type manually OR use current location */}
                  <div className="location-row">
                    <input
                      type="text"
                      placeholder="Search Location"
                      value={query}
                      onFocus={() => setShowLocationSearch(true)}
                      onChange={handleLocationChange}
                      className="styled-input"
                    />
                    <Button
                      type="button"
                      className="location-btn"
                      onClick={() => handleUseCurrentLocation(setFieldValue)}
                    >
                      {locationLoading ? '...' : '📍'}
                    </Button>
                  </div>

                  {showLocationSearch && locations.length > 0 && (
                    <ul className="location-suggestions">
                      {locations.map((loc, i) => (
                        <li
                          key={i}
                          onClick={() => handleSelectLocation(loc, setFieldValue)}
                        >
                          <strong>{loc.name}</strong>
                        </li>
                      ))}
                    </ul>
                  )}
                  <ErrorMessage name="location.place" component="div" className="error-text" />
                </div>

                {/* ADS */}
                <FieldArray name="ads">
                  {({ push, remove }) => (
                    <>
                      {values.ads.map((ad, adIndex) => (
                        <div key={adIndex} className="card-box">
                          <div className="card-header-row">
                            <h6>Ad {adIndex + 1}</h6>
                            <IoCloseCircleOutline size={22} color="red" onClick={() => remove(adIndex)} />
                          </div>

                          <Field as="select" name={`ads.${adIndex}.type`} className="styled-input">
                            <option value="">Select Type</option>
                            <option value="rent">Rent</option>
                            <option value="service">Service</option>
                          </Field>

                          <Field as="select" name={`ads.${adIndex}.category`} className="styled-input">
                            <option value="">Select Category</option>
                            {categories[values.ads?.[adIndex]?.type]?.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </Field>

                          <Field name={`ads.${adIndex}.title`} placeholder="Title" className="styled-input" />
                          <Field as="textarea" name={`ads.${adIndex}.description`} placeholder="Description" className="styled-input" />

                          {/* PRICE */}
                          <FieldArray name={`ads.${adIndex}.prices`}>
                            {({ push: pushPrice, remove: removePrice }) => (
                              <>
                                {ad.prices?.map((price, priceIndex) => (
                                  <div key={priceIndex} className="price-box">
                                    <Field as="select" name={`ads.${adIndex}.prices.${priceIndex}.category`} className="styled-input">
                                      <option value="">Category</option>
                                      <option value="duration">Duration</option>
                                      <option value="size">Size</option>
                                      <option value="custom">Custom</option>
                                    </Field>
                                    <ErrorMessage name={`ads.${adIndex}.prices.${priceIndex}.category`} component="div" className="error-text" />

                                    {values.ads[adIndex].prices[priceIndex].category === 'custom' && (
                                      <Field name={`ads.${adIndex}.prices.${priceIndex}.unit`} placeholder="Custom Unit" className="styled-input" />
                                    )}
                                    {values.ads[adIndex].prices[priceIndex].category === 'size' && (
                                      <Field as="select" name={`ads.${adIndex}.prices.${priceIndex}.unit`} className="styled-input">
                                        <option value="">Unit</option>
                                        <option value="Inch">Inch</option>
                                        <option value="Centimeter">Centimeter</option>
                                      </Field>
                                    )}
                                    {values.ads[adIndex].prices[priceIndex].category === 'duration' && (
                                      <Field as="select" name={`ads.${adIndex}.prices.${priceIndex}.unit`} className="styled-input">
                                        <option value="">Unit</option>
                                        <option value="Hour">Hour</option>
                                        <option value="Day">Day</option>
                                        <option value="Week">Week</option>
                                        <option value="Month">Month</option>
                                      </Field>
                                    )}
                                    <ErrorMessage name={`ads.${adIndex}.prices.${priceIndex}.unit`} component="div" className="error-text" />

                                    <Field name={`ads.${adIndex}.prices.${priceIndex}.price`} placeholder="Price" className="styled-input" />
                                    <ErrorMessage name={`ads.${adIndex}.prices.${priceIndex}.price`} component="div" className="error-text" />

                                    {ad.prices.length > 1 && (
                                      <IoCloseCircleOutline size={20} color="red" onClick={() => removePrice(priceIndex)} />
                                    )}
                                  </div>
                                ))}
                                <button type="button" className="add-small-btn" onClick={() => pushPrice({ category: '', unit: '', price: '' })}>
                                  + Add Price
                                </button>
                              </>
                            )}
                          </FieldArray>

                          {/* IMAGE UPLOAD */}
                          <div className="upload-box">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => {
                                const newFiles = Array.from(e.target.files)
                                const existingFiles = values.ads[adIndex].images || []
                                const existingPreviews = values.ads[adIndex].imagePreviews || []
                                const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
                                setFieldValue(`ads.${adIndex}.images`, [...existingFiles, ...newFiles])
                                setFieldValue(`ads.${adIndex}.imagePreviews`, [...existingPreviews, ...newPreviews])
                                e.target.value = null
                              }}
                            />
                          </div>

                          <div className="image-preview-container">
                            {ad.imagePreviews?.map((src, i) => (
                              <div key={i} className="preview-box">
                                <img src={src} alt="preview" />
                                <IoCloseCircleOutline
                                  size={20}
                                  color="red"
                                  onClick={() => {
                                    const updatedFiles = [...values.ads[adIndex].images]
                                    const updatedPreviews = [...values.ads[adIndex].imagePreviews]
                                    updatedFiles.splice(i, 1)
                                    updatedPreviews.splice(i, 1)
                                    setFieldValue(`ads.${adIndex}.images`, updatedFiles)
                                    setFieldValue(`ads.${adIndex}.imagePreviews`, updatedPreviews)
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        className="add-ad-btn"
                        onClick={() => push({ type: '', category: '', title: '', description: '', prices: [], images: [], imagePreviews: [] })}
                      >
                        + Add Ad
                      </button>
                    </>
                  )}
                </FieldArray>

                {/* SUBMIT */}
                <div className="bottom-bar">
                  <Button type="submit" className="primary-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                    ) : 'SUBMIT ALL'}
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  )
}