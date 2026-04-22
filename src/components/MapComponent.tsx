import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapComponentProps {
  center: { latitude: number; longitude: number };
  zoom?: number;
  marker?: { latitude: number; longitude: number } | null;
  onMapClick?: (coords: { latitude: number; longitude: number }) => void;
  style?: string;
}

const NEPAL_BOUNDS: [[number, number], [number, number]] = [[80.0, 26.0], [89.0, 31.0]];

const MapComponent: React.FC<MapComponentProps> = ({ 
  center, 
  zoom = 13, 
  marker, 
  onMapClick,
  style = 'https://tiles.openfreemap.org/styles/liberty'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (map.current) return; // Initialize only once

    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: style,
        center: [center.longitude, center.latitude],
        zoom: zoom,
        attributionControl: false,
        maxBounds: NEPAL_BOUNDS
      });

      map.current.addControl(new maplibregl.NavigationControl({
        showCompass: false,
        visualizePitch: false
      }), 'top-right');

      map.current.on('click', (e) => {
        if (onMapClick) {
          onMapClick({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
        }
      });
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update center
  useEffect(() => {
    if (map.current) {
      map.current.setCenter([center.longitude, center.latitude]);
    }
  }, [center.latitude, center.longitude]);

  // Update marker
  useEffect(() => {
    if (!map.current) return;

    if (marker) {
      if (!markerRef.current) {
        markerRef.current = new maplibregl.Marker({ color: "#10b981" })
          .setLngLat([marker.longitude, marker.latitude])
          .addTo(map.current);
      } else {
        markerRef.current.setLngLat([marker.longitude, marker.latitude]);
      }
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [marker]);

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
};

export default MapComponent;
