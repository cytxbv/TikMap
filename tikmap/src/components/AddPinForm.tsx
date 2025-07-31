import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Category } from '../types';

interface Props {
  map: google.maps.Map | null;
  selectedLocation: google.maps.LatLngLiteral | null;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: Category[];
}

const AddPinForm: React.FC<Props> = ({
  map,
  selectedLocation,
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Placeholder for future location search logic

  const handleAddPin = async () => {
    if (!map || !selectedLocation || !tiktokUrl || !selectedCategory) return;

    const videoIdMatch = tiktokUrl.match(/video\/(\d+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    if (!videoId) {
      alert('Please enter a valid TikTok URL');
      return;
    }

    const fetchURL = `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@user/video/${videoId}`;

    try {
      const res = await fetch(fetchURL);
      const meta = await res.json();

      const marker = new google.maps.Marker({
        position: selectedLocation,
        map,
        icon: {
          url: meta.thumbnail_url,
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<iframe src="https://www.tiktok.com/embed/v2/${videoId}" height="500" width="300" frameborder="0" allowfullscreen></iframe>`,
      });

      marker.addListener('click', () => infoWindow.open(map, marker));

      await supabase.from('pins').insert([
        {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          tiktok_url: tiktokUrl,
          thumbnail_url: meta.thumbnail_url,
          category: selectedCategory,
        },
      ]);

      setTiktokUrl('');
    } catch (err) {
      console.error('Error adding pin:', err);
    }
  };


  const topBarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#ffffff',
    padding: '16px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  };

  const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '220px',
  };

  const selectStyle: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 500,
    cursor: 'pointer',
  };

  return (
    <div style={topBarStyle}>
      <div style={searchContainerStyle}>
        <input
        id = "search-box"
          type="text"
          placeholder="Search Location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Enter TikTok URL"
          value={tiktokUrl}
          onChange={(e) => setTiktokUrl(e.target.value)}
          style={inputStyle}
        />
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <button onClick={handleAddPin} style={buttonStyle}>
          Add Pin
        </button>
      </div>
    </div>
  );
};

export default AddPinForm;
