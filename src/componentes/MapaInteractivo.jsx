import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '1rem',
};

const center = {
  lat: -12.0883, // <-- Coordenadas de Av. Primavera 123, Miraflores
  lng: -77.0049,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ],
};

const GOOGLE_MAPS_API_KEY = 'TU_CLAVE_DE_API_AQUI'; // <-- ¡IMPORTANTE!

export default function MapaInteractivo({ onUbicacionSeleccionada }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [marker, setMarker] = useState(center);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const autocompleteRef = useRef(null);

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarker({ lat, lng });
    onUbicacionSeleccionada({ lat, lng });
  }, [onUbicacionSeleccionada]);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMarker({ lat, lng });
      setSelectedPlace(place);
      onUbicacionSeleccionada({ lat, lng }, place.formatted_address);
    }
  };

  if (loadError) return <div className="text-red-500">Error al cargar el mapa. Asegúrate de que la clave de API sea correcta.</div>;
  if (!isLoaded) return <div className="text-center p-4">Cargando mapa...</div>;

  return (
    <div>
      <h3 className="text-xl font-semibold text-[#8f2133] mb-4">Ingresa tu dirección de entrega</h3>
      <div className="mb-4 relative">
         <Autocomplete
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlaceChanged={handlePlaceSelect}
          >
            <input
              type="text"
              placeholder="Busca tu dirección o haz clic en el mapa"
              className="w-full px-4 py-2 border border-[#f5bfb2] rounded-xl focus:ring-2 focus:ring-[#d8718c] outline-none"
            />
          </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={marker}
        options={options}
        onClick={handleMapClick}
      >
        <Marker position={marker} />
        <Marker 
            position={center} 
            icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            }}
            title="Nuestra Tienda"
        />
      </GoogleMap>

      {selectedPlace && (
        <div className="mt-4 p-4 bg-[#fff3f0] border border-[#f5bfb2] rounded-xl text-sm">
            <p className="font-bold text-[#8f2133]">Ubicación seleccionada:</p>
            <p className="text-gray-700">{selectedPlace.formatted_address}</p>
        </div>
      )}
    </div>
  );
}
