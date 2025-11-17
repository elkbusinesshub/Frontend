// LocationSearch.jsx
import React, { useState } from 'react';
import axios from 'axios';

// FIX: Using environment variable instead of hardcoded key
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const LocationSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json`,
          {
            params: {
              access_token: MAPBOX_TOKEN,
              autocomplete: true,
              limit: 5,
            },
          }
        );
        setResults(response.data.features);
      } catch (err) {
        console.error('Error fetching location', err);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelect = (place) => {
    setQuery(place.place_name);
    setResults([]);
    onSelect(place); // Send data to parent
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        className="w-full border border-gray-300 rounded-md px-4 py-2"
        placeholder="Search for a location"
        value={query}
        onChange={handleSearch}
      />
      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full rounded-md mt-1 shadow-md">
          {results.map((place) => (
            <li
              key={place.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(place)}
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;