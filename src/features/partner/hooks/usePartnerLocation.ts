import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { deliveryRepository } from '../../../services/deliveryService';

export const usePartnerLocation = (isOnline: boolean) => {
  const { user } = useAuth();
  const [coordinates, setCoordinates] = useState({ latitude: -23.55052, longitude: -46.633308 }); // Default centered around Sao Paulo or standard mock location
  const coordsRef = useRef(coordinates);

  // Keep coordsRef up-to-date with current coordinates state
  useEffect(() => {
    coordsRef.current = coordinates;
  }, [coordinates]);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!user || !isOnline) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Periodically update coordinates (simulating movement or actual GPS if available)
    const updateLocation = async () => {
      // Simulate minor movements for testing the tracking maps using the latest ref value
      const currentCoords = coordsRef.current;
      const newLat = currentCoords.latitude + (Math.random() - 0.5) * 0.001;
      const newLng = currentCoords.longitude + (Math.random() - 0.5) * 0.001;
      const nextCoords = { latitude: newLat, longitude: newLng };
      
      setCoordinates(nextCoords);
      try {
        // Commented out location updates as map feature is skipped for now
        // await deliveryRepository.updateRiderLocation(user.uid, newLat, newLng);
      } catch (err) {
        console.error('Failed to update rider location in DB:', err);
      }
    };

    // Run initially
    updateLocation();

    // Broadcast location every 15 seconds (Commented out for now as map feature is skipped)
    // timerRef.current = setInterval(updateLocation, 15000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [user, isOnline]);

  return coordinates;
};

