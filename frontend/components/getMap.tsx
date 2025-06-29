

'use client';

import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

type Props = {
  location: string; // name or zip code
};

const containerStyle = {
  width: '100%',
  height: '400px',
};

export default function EventMap({ location }: Props) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    async function fetchCoords() {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      console.log("Geocoding result:", data);
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setCoords({ lat, lng });
      }
    }
    fetchCoords();
  }, [location]);

  if (!coords) return <div>Loading map...</div>;

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap mapContainerStyle={containerStyle} center={coords} zoom={15}>
        <Marker position={coords} />
      </GoogleMap>
    </LoadScript>
  );
}
