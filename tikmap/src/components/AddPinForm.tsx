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

const AddPinForm: React.FC<Props> = ({ map, selectedLocation, selectedCategory, onCategoryChange, categories }) => {
  const [tiktokUrl, setTiktokUrl] = useState('');

  //async as it includes asynchronous operations like API calls and DB inserts
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
        //await to ensure fetchURL is avaialble before res 
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
        content: `<iframe src="https://www.tiktok.com/embed/v2/${videoId}" height="500" width="300" frameborder="0" allowfullscreen></iframe>`
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
      console.error("Error adding pin:", err);
    }
  };

  return (
    <div style={{ background: 'white', padding: '10px', zIndex: 1 }}>
      <input id='search-box' type='text' placeholder='Search Location...' style={{ width: '250px' }} /><br />
      <input
        type='text'
        placeholder='Enter TikTok URL'
        value={tiktokUrl}
        onChange={(e) => setTiktokUrl(e.target.value)}
        style={{ width: '250px', marginTop: '5px' }}
      />
      <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} style={{ marginLeft: '5px' }}>
        <option value="">-- Select Category --</option>
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>{cat.label}</option>
        ))}
      </select>
      <button onClick={handleAddPin} style={{ marginLeft: '5px' }}>Add Pin</button>
    </div>
  );
};

export default AddPinForm;
