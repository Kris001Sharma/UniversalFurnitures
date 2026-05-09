/**
 * Robust Geolocation Handler
 * Handles permission states and provides consistent behavior for location tagging
 */

export interface GeolocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export async function getGeolocation(): Promise<GeolocationResult> {
  if (!navigator.geolocation) {
    throw new Error('GEOLOCATION_NOT_SUPPORTED');
  }

  // Check permission status if API is available (Chrome/Firefox/Edge)
  if (navigator.permissions && (navigator.permissions as any).query) {
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      if (status.state === 'denied') {
        throw new Error('GEOLOCATION_PERMISSION_DENIED');
      }
    } catch (e) {
      console.warn('Permissions API query failed:', e);
    }
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('GEOLOCATION_PERMISSION_DENIED'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('GEOLOCATION_POSITION_UNAVAILABLE'));
            break;
          case error.TIMEOUT:
            reject(new Error('GEOLOCATION_TIMEOUT'));
            break;
          default:
            reject(new Error('GEOLOCATION_ERROR'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

export function handleGeolocationError(error: any): string {
  const message = error.message || error;
  
  if (message === 'GEOLOCATION_PERMISSION_DENIED') {
    return 'Location access is denied. Please enable it in your browser/phone settings and click again.';
  }
  if (message === 'GEOLOCATION_POSITION_UNAVAILABLE') {
    return 'Location information is unavailable. Please check your GPS signal.';
  }
  if (message === 'GEOLOCATION_TIMEOUT') {
    return 'Location request timed out. Please try again.';
  }
  if (message === 'GEOLOCATION_NOT_SUPPORTED') {
    return 'Geolocation is not supported by this browser.';
  }
  
  return 'An unexpected error occurred while getting location. Please try again.';
}
