import { useState, useEffect } from 'react';
import axios from 'axios';
import "./ImageUploadForm.css";
import { useGetPlaceMutation, useGetPlaceSearchQuery  } from '../store/services/place.service';

const CurrentLocationButton = ({ onSubmit, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showSelectLocation, setShowSelectLocation] = useState(false);
  // const [location, setLocation] = useState([]);
  const [query, setQuery] = useState('');
  const [address, setAddress] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);

  console.log(query)  
   const {data:locationData, isLoading: locationDataLoading} = useGetPlaceSearchQuery({
          query: query,
          limited: false
        }, {
      skip: !query || query.trim() === '',
    });


  const [updateLocation, {isLoading: updateLocationLoading}] = useGetPlaceMutation();
  // useEffect(() => {
  //   if (selectedLocation) {
  //     const selected = location.find(loc => loc.name === selectedLocation);
  //     if (selected) {
  //       setAddress(selected);
  //     }
  //   }
  // }, [selectedLocation, location]);

  console.log("locationData",locationData)

  // const fetchAdLocations = async (query) => {
  //   if (query === '') {
  //     return;
  //   }
  //   try {
  //     const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/place_search`,
  //       {
  //         query: query,
  //         limited: false
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     const allLocations = response.data;
  //     setLocation(allLocations);
  //   } catch (error) {
  //     console.error("Error fetching location:", error);
  //   }
  // };

  // const handleSelect = (loc) => {
  //   setSelectedLocation(loc.name);
  //   setAddress(loc);
  //   setQuery(loc.name);
  //   setLocation([]);
  // };

  const handleSelect = (loc) => {
  setSelectedLocation(loc.name);
  setAddress(loc);
  setQuery(loc.name);
  setShowSuggestions(false); // 👈 KEY LINE
};


  const handleUpload = async (event) => {
    event.preventDefault();
    if (selectedLocation === "") {
      alert('Select a location');
    } else {
      onSubmit(address);
    }
  };

  // const handleChange = (e) => {
  //   const value = e.target.value;
  //   setQuery(value);
  //   // fetchAdLocations(value);
  // };

  const handleChange = (e) => {
  const value = e.target.value;
  setQuery(value);
  setShowSuggestions(true);
};



  const handleGetLocation = () => {
    // setLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      // setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const payload = {
          latitude: latitude,
          longitude: longitude
        }
        try {
          // const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/get_place`, payload);
          const response = await updateLocation(payload);
          const place = response.data;          
          setLocationName(place.place);
          onSubmit(place);
        } catch (err) {
          console.error('Error reverse geocoding:', err);
        }
        // setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Failed to get your location');
        // setLoading(false);
      }
    );
  };

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
            {updateLocationLoading ? 'Getting location...' : 'Use My Current Location'}
          </button>
        </div>
        {showSelectLocation && (
          <form className="image-upload-form" onSubmit={handleUpload}>
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            {showSuggestions && locationData?.length > 0 && (
              <ul className="location-suggestions border rounded bg-white shadow mt-1 max-h-60 overflow-y-auto">
                {locationData?.map((loc, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(loc)}
                  >
                    <strong>{loc.name}</strong>
                  </li>
                ))}
              </ul>
            )}
            <div className="form-actions">
              <button type="submit" className="btn-submit">Set</button>
            </div>
          </form>
        )}
        <button type="button" className="btn-cancel mt-4" onClick={onClose}>Back</button>
        {locationName && (
          <p className="mt-2 text-sm text-gray-600">Location: {locationName}</p>
        )}
      </div>
    </>
  );
};

export default CurrentLocationButton;