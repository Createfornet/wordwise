import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { LatLngExpression, LatLngTuple } from 'leaflet';

import { useGeolocation } from './../hooks/useGeolocation';
import { useCities } from '../contexts/CitiesContext';
import styles from './Map.module.css';
import Button from './Button';
import useUrlPosition from '../hooks/useUrlPosition';

function Map() {
  const [position, setPosition] = useState([40, 0] as LatLngTuple);
  const { cities } = useCities();
  const {
    isLoading: isLoadingPosition,
    position: userPosition,
    getPosition,
  } = useGeolocation();
  const [lat, lng] = useUrlPosition();
  
  useEffect(
    function () {
      if (lat !== 0 && lng !== 0) setPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (userPosition) setPosition([userPosition.lat, userPosition.lng]);
    },
    [userPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!userPosition && (
        <Button type='position' onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Use yor position'}
        </Button>
      )}
      <MapContainer center={position} zoom={6} className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        />
        {cities.map((city) => (
          <Marker
            position={
              [city.position.lat, city.position.lng] as LatLngExpression
            }
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName} </span>
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={position} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }: { position: LatLngTuple }) {
  const map = useMap();
  const [lat, lng] = position;
  map.setView([lat || 0, lng || 0]);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form/?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });

  return null;
}

export default Map;
