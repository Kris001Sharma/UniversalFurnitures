import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapUpdater({ isFullscreen, lat, lng, trigger }: { isFullscreen: boolean, lat?: number, lng?: number, trigger?: number }) {
  const map = useMap();
  
  // Handle resize
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [isFullscreen, map]);

  // Handle centering ONLY on trigger change
  const lastTrigger = useRef(0);
  useEffect(() => {
    if (trigger !== undefined && trigger !== lastTrigger.current && lat !== undefined && lng !== undefined) {
      lastTrigger.current = trigger;
      map.setView([lat, lng], 15); // Zoom in for navigation/location
    }
  }, [trigger, lat, lng, map]);

  return null;
}

function RoutingMachine({ waypoints }: { waypoints: {lat: number, lng: number}[] }) {
  const [path, setPath] = useState<[number, number][]>([]);

  const waypointsStr = JSON.stringify(waypoints);

  useEffect(() => {
    if (waypoints.length < 2) {
      setPath([]);
      return;
    }

    const fetchRoute = async () => {
      try {
        const coords = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates;
          setPath(coordinates.map((c: [number, number]) => [c[1], c[0]]));
        } else {
          setPath(waypoints.map(wp => [wp.lat, wp.lng]));
        }
      } catch (err) {
        console.error("Failed to fetch route", err);
        setPath(waypoints.map(wp => [wp.lat, wp.lng]));
      }
    };

    fetchRoute();
  }, [waypointsStr]);

  if (path.length === 0) return null;

  return (
    <Polyline 
      positions={path} 
      color="#3b82f6" 
      weight={6} 
      opacity={0.8} 
      dashArray={path.length === waypoints.length ? "10, 10" : undefined}
    />
  );
}

export default function DeliveryMap({ 
  userLocation, 
  isMapFullscreen, 
  mapCenterTrigger, 
  routePoints, 
  navigatingTaskId, 
  targetTasks, 
  optimizedTasks, 
  handleStartDelivery 
}: any) {
  return (
    <MapContainer 
      center={userLocation ? [userLocation.lat, userLocation.lng] : [27.7172, 85.3240]} 
      zoom={13} 
      minZoom={10}
      maxZoom={16}
      maxBounds={[[26.3, 80.0], [30.5, 88.2]]}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={isMapFullscreen}
      attributionControl={false}
    >
      <MapUpdater 
        isFullscreen={isMapFullscreen} 
        lat={userLocation?.lat ?? 27.7172} 
        lng={userLocation?.lng ?? 85.3240} 
        trigger={mapCenterTrigger} 
      />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* User Location Marker */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {/* Route Polyline for In Progress tasks */}
      {routePoints.length > 1 && (
        <RoutingMachine waypoints={routePoints} />
      )}

      {/* Task Markers */}
      {(navigatingTaskId ? targetTasks : optimizedTasks).map((task: any) => (
        task.lat && task.lng && (
          <Marker key={task.id} position={[task.lat, task.lng]}>
            <Popup>
              <div className="text-xs">
                <strong>{task.orgName}</strong><br/>
                {task.orderId}
                {task.status === 'Open' && (
                  <button 
                    onClick={() => handleStartDelivery(task.id)}
                    className="mt-2 w-full py-1.5 bg-orange-500 text-white rounded-lg text-[10px] font-bold shadow-sm hover:bg-orange-600 transition-colors"
                  >
                    Start Task
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}
