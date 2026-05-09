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

  // Force a fresh request every time this is called to trigger the system prompt if not blocked
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
        console.warn('Geolocation error code:', error.code);
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
        maximumAge: 0, // Force fresh data
      }
    );
  });
}

export function handleGeolocationError(error: any): string {
  const message = error.message || error;
  
  if (message === 'GEOLOCATION_PERMISSION_DENIED') {
    return 'Location access is denied. Please reset the site permissions in your browser settings (usually the lock icon in the address bar) and click Tag GPS again to see the prompt.';
  }
  if (message === 'GEOLOCATION_POSITION_UNAVAILABLE') {
    return 'Location information is unavailable. Please check your GPS signal or ensure location is enabled on your device.';
  }
  if (message === 'GEOLOCATION_TIMEOUT') {
    return 'Location request timed out. Please try again with a better signal.';
  }
  if (message === 'GEOLOCATION_NOT_SUPPORTED') {
    return 'Geolocation is not supported by this browser.';
  }
  
  return 'An unexpected error occurred while getting location. Please try again.';
}
