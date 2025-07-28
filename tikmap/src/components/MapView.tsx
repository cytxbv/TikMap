import React, { useEffect, useRef } from 'react';

interface MapViewProps {
  setMap: (map: google.maps.Map) => void;
  setSelectedLocation: (loc: google.maps.LatLngLiteral) => void;
  selectedCategory: string;
  pins: any[];
}

const MapView: React.FC<MapViewProps> = ({ setMap, setSelectedLocation, selectedCategory, pins }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Initialize the map
  useEffect(() => {
    const initializeMap = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const mapObj = new google.maps.Map(mapRef.current!, {
          center,
          zoom: 15,
        });

        mapInstanceRef.current = mapObj;
        setMap(mapObj);

        new google.maps.Marker({
          position: center,
          map: mapObj,
          title: 'Your Location',
        });

        const input = document.getElementById("search-box") as HTMLInputElement;
        if (input) {
          const autocomplete = new google.maps.places.Autocomplete(input);
          autocomplete.bindTo("bounds", mapObj);

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) return;
            const location = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            mapObj.setCenter(location);
            setSelectedLocation(location);
          });
        }
      });
    };

    if (!window.google?.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;

      script.async = true;
      document.body.appendChild(script);
      script.onload = initializeMap;
    } else {
      initializeMap();
    }
  }, [setMap, setSelectedLocation, apiKey]);

  // Render markers when pins change
  useEffect(() => {
    if (!mapInstanceRef.current || !pins) return;

    // Clear previous markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    pins.forEach((pin) => {
      const videoId = pin.tiktok_url.match(/video\/(\d+)/)?.[1];
      if (!videoId) return;

      const marker = new google.maps.Marker({
        position: { lat: pin.lat, lng: pin.lng },
        map: mapInstanceRef.current!,
        icon: pin.thumbnail_url
          ? { url: pin.thumbnail_url, scaledSize: new google.maps.Size(40, 40) }
          : undefined,
      });

      const content = `<iframe src="https://www.tiktok.com/embed/v2/${videoId}" width="300" height="500"></iframe>`;
      const infoWindow = new google.maps.InfoWindow({ content });
      marker.addListener("click", () => infoWindow.open(mapInstanceRef.current!, marker));
      markersRef.current.push(marker);
    });
  }, [pins]);

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />;
};

export default MapView;
