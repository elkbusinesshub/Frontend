import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './ImageUploadForm.css'
import {
  useGetPlaceMutation,
  useGetPlaceSearchQuery,
  useGetPlaceDetailsQuery,
} from '../store/services/place.service'

const CurrentLocationButton = ({ onSubmit, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [locationName, setLocationName] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [showSelectLocation, setShowSelectLocation] = useState(false)
  const [query, setQuery] = useState('')
  const [address, setAddress] = useState({})
  const [showSuggestions, setShowSuggestions] = useState(false)

  const searchRef = useRef(null)

  const { data: locationData, isLoading: locationDataLoading } =
    useGetPlaceSearchQuery(
      {
        query: query,
        limited: false,
      },
      {
        skip: !query || query.trim() === '',
      },
    )

  const [updateLocation, { isLoading: updateLocationLoading }] =
    useGetPlaceMutation()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [selectedPlaceId, setSelectedPlaceId] = useState(null)

  const { data: placeDetails, isLoading: placeDetailsLoading } =
    useGetPlaceDetailsQuery(
      { placeId: selectedPlaceId },
      { skip: !selectedPlaceId },
    )

  useEffect(() => {
    if (placeDetails) {
      setAddress((prev) => ({
        ...prev,
        latitude: placeDetails.latitude,
        longitude: placeDetails.longitude,
        ...placeDetails,
      }))
    }
  }, [placeDetails])

  const handleSelect = (loc) => {
    setSelectedLocation(loc.mainText)
    setQuery(loc.mainText)
    setShowSuggestions(false)
    setSelectedPlaceId(loc.placeId)
  }

  const handleUpload = async (event) => {
    event.preventDefault()
    if (selectedLocation === '') {
      alert('Select a location')
    } else {
      onSubmit(address)
    }
  }

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setShowSuggestions(true)
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const payload = { latitude, longitude }
        try {
          const response = await updateLocation(payload)
          const place = response.data
          setLocationName(place.place)
          onSubmit(place)
        } catch (err) {
          console.error('Error reverse geocoding:', err)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Failed to get your location')
      },
    )
  }

  return (
    <>
      <div className="image-upload-form">
        <label>Set the location for your Ad</label>
        <br />
        <div className="form-actions">
          <button
            type="button"
            className="btn-submit"
            onClick={() => setShowSelectLocation(true)}
            disabled={updateLocationLoading}
          >
            Select Location Manually
          </button>
          <button
            type="button"
            className="btn-submit"
            onClick={handleGetLocation}
            disabled={updateLocationLoading}
          >
            {updateLocationLoading
              ? 'Getting location...'
              : 'Use My Current Location'}
          </button>
        </div>

        {showSelectLocation && (
          <form className="image-upload-form" onSubmit={handleUpload}>
            <div ref={searchRef} style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleChange}
                onFocus={() => setShowSuggestions(true)}
                className="border p-2 rounded w-full"
              />
              {showSuggestions && locationData?.length > 0 && (
                <ul
                  className="location-suggestions border rounded bg-white shadow mt-1 max-h-60 overflow-y-auto"
                  style={{ position: 'absolute', width: '100%', zIndex: 10 }}
                >
                  {locationData.map((loc, index) => (
                    <li key={index} onClick={() => handleSelect(loc)}>
                      <strong>{loc.mainText}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="form-actions">
              {/* <button type="submit" className="btn-submit">Set</button> */}
              <button
                type="submit"
                className="btn-submit"
                disabled={placeDetailsLoading}
              >
                {placeDetailsLoading ? 'Loading...' : 'Set'}
              </button>
            </div>
          </form>
        )}

        <button type="button" className="btn-cancel mt-4" onClick={onClose}>
          Back
        </button>
        {locationName && (
          <p className="mt-2 text-sm text-gray-600">Location: {locationName}</p>
        )}
      </div>
    </>
  )
}

export default CurrentLocationButton
