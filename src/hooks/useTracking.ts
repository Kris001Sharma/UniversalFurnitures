import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/data.service';
import { getGeolocation } from '../utils/location';

export const useTracking = () => {
  const { profile } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateLocation = async () => {
      if (!profile?.id || profile.duty_status !== 'On Duty') return;

      try {
        const pos = await getGeolocation();
        if (pos) {
          await dataService.updateHeartbeat({
            user_id: profile.id,
            latitude: pos.latitude,
            longitude: pos.longitude,
            // heading, speed etc can be added if available from more advanced GPS APIs
          });
          console.debug('Heartbeat updated');
        }
      } catch (err) {
        console.warn('Heartbeat failed:', err);
      }
    };

    if (profile?.duty_status === 'On Duty') {
      // Immediate update
      updateLocation();
      
      // Start interval (every 1 minute for a balance of battery and real-time)
      // Production setting: could be 30s-2m
      intervalRef.current = setInterval(updateLocation, 60000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [profile?.id, profile?.duty_status]);

  return null;
};
