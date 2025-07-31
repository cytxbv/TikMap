// src/App.tsx
import React, { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import AddPinForm from './components/AddPinForm';
import { Category } from './types';
import { supabase } from './supabaseClient';


const App: React.FC = () => {
  //ref to googlemaps once it is initialised in mapView
  const [map, setMap] = useState<google.maps.Map | null>(null);

  //store gps coord lat and lng when user adds a pin
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);

  //store list of categories objects with labels, values used to classify the pins
  const [categories, setCategories] = useState<Category[]>([]);

  //keep track of which category user selected 
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [pins, setPins] = useState<any[]>([]);


useEffect(() => {
  const fetchPins = async () => {
    if (!selectedCategory) return;

    const { data, error } = await supabase
      .from('pins')
      .select('*')
      .eq('category', selectedCategory); 

    if (error) {
      console.error('Failed to fetch pins:', error);
      return;
    }

    setPins(data || []);
  };

  fetchPins();
}, [selectedCategory]);




  useEffect(() => {
    const fetchCategories = async() =>{
      const{data , error} = await supabase.from('categories').select('*');
      if (error) {
        console.error('Error fetching categories', error);

      } else if(data){
        setCategories(data);
      }
    };
    fetchCategories();
  },[]
  );


  const handleAddCategory = (newCategory: Category) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
  categories={categories}
  onAddCategory={handleAddCategory}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
  pins={pins}

/>

      <div style={{ flex: 1, position: 'relative' }}>
      <AddPinForm
      map={map}
      selectedLocation={selectedLocation}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      categories={categories}
    />


<MapView
  setMap={setMap}
  setSelectedLocation={setSelectedLocation}
  selectedCategory={selectedCategory}
  pins={pins}
/>


      </div>
    </div>
  );
};

export default App;
