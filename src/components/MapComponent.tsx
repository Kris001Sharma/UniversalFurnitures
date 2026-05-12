import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Truck, Briefcase, Building, Home, School, ShieldPlus, Store, MapPin, Coffee, Dumbbell, Plane, Users, User } from 'lucide-react';

interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  color?: string;
  label?: string;
  type?: 'SALES' | 'DELIVERY' | 'CLIENT' | 'LEAD' | 'ADMIN';
  category?: string;
  isActive?: boolean;
  statusInfo?: string;
}

interface MapComponentProps {
  center: { latitude: number; longitude: number };
  zoom?: number;
  markers?: MarkerData[];
  selectedId?: string | null;
  routePoints?: { latitude: number; longitude: number }[];
  onMarkerClick?: (marker: MarkerData) => void;
  onMapClick?: (coords: { latitude: number; longitude: number }) => void;
  style?: string;
}

const NEPAL_BOUNDS: [[number, number], [number, number]] = [[80.0, 26.0], [89.0, 31.0]];

const MapComponent: React.FC<MapComponentProps> = ({ 
  center, 
  zoom = 13, 
  markers = [], 
  selectedId = null,
  routePoints = [],
  onMarkerClick,
  onMapClick,
  style = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  const popupRef = useRef<maplibregl.Popup | null>(null);

  useEffect(() => {
    if (map.current) return;

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

      map.current.on('load', () => {
        map.current?.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });

        map.current?.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 6,
            'line-opacity': 0.8
          }
        });
      });

      // Handle resize
      const observer = new ResizeObserver(() => {
        map.current?.resize();
      });
      observer.observe(mapContainer.current);

      return () => {
        observer.disconnect();
        map.current?.remove();
        map.current = null;
      };
    }
  }, []);

  // Update popup when selection changes
  useEffect(() => {
    if (!map.current || !selectedId) {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      return;
    }

    const selectedMarker = markers.find(m => m.id === selectedId);
    if (selectedMarker) {
      // Find the marker element to add highlighting
      Object.keys(markersRef.current).forEach(id => {
        const marker = markersRef.current[id];
        const el = marker.getElement();
        if (id === selectedId) {
          el.style.transform = `${el.style.transform.split('rotate')[0]} scale(1.2)`;
          el.style.filter = 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.4))';
          el.style.zIndex = '1000';
        } else {
          el.style.transform = el.style.transform.replace(/scale\(.*?\)/g, '').trim();
          el.style.filter = 'none';
        }
      });

      // Show popup
      if (!map.current) return;
      if (popupRef.current) popupRef.current.remove();

      const popupNode = document.createElement('div');
      const root = createRoot(popupNode);
      root.render(
        <div style={{ padding: '8px', minWidth: '140px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}>{selectedMarker.label}</div>
          <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 'bold' }}>
            {selectedMarker.type} {selectedMarker.category ? `• ${selectedMarker.category}` : ''}
          </div>
          {selectedMarker.statusInfo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '4px', marginTop: '4px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: selectedMarker.isActive ? '#10b981' : '#cbd5e1' }} />
              <div style={{ fontSize: '10px', color: '#475569', fontWeight: '500' }}>{selectedMarker.statusInfo}</div>
            </div>
          )}
        </div>
      );

      const popup = new maplibregl.Popup({
        closeButton: false,
        offset: [0, -35]
      })
        .setLngLat([selectedMarker.longitude, selectedMarker.latitude])
        .setDOMContent(popupNode)
        .addTo(map.current);

      popupRef.current = popup;
    }
  }, [selectedId, markers]);

  // Update center
  useEffect(() => {
    if (map.current) {
      map.current.flyTo({ 
        center: [center.longitude, center.latitude],
        zoom: zoom
      });
    }
  }, [center.latitude, center.longitude, zoom]);

  // Handle Route
  useEffect(() => {
    if (!map.current || routePoints.length < 2) {
      if (map.current?.getSource('route')) {
        (map.current.getSource('route') as maplibregl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [] }
        });
      }
      return;
    }

    const fetchRoute = async () => {
      try {
        const coords = routePoints.map((wp: any) => `${wp.longitude},${wp.latitude}`).join(';');
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
        const data = await res.json();
        
        if (data.routes && data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates;
          const source = map.current?.getSource('route') as maplibregl.GeoJSONSource;
          if (source) {
            source.setData({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coordinates
              }
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch route", err);
      }
    };

    if (map.current.isStyleLoaded()) {
      fetchRoute();
    } else {
      map.current.once('load', fetchRoute);
    }
  }, [routePoints]);

  // Sync Markers
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers that are no longer in the list
    const currentIds = new Set(markers.map(m => m.id));
    Object.keys(markersRef.current).forEach(id => {
      if (!currentIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    markers.forEach(mData => {
      // get icon helper
      const getIconForMarker = (type?: string, category?: string) => {
        if (type === 'SALES') return <User size={16} color="white" />;
        if (type === 'DELIVERY') return <Truck size={16} color="white" />;
        if (type === 'ADMIN') return <MapPin size={18} color="white" />;
        
        const cat = (category || '').toLowerCase();
        if (cat.includes('school') || cat.includes('college') || cat.includes('education')) return <School size={16} color="white" />;
        if (cat.includes('hospital') || cat.includes('clinic') || cat.includes('health') || cat.includes('medical')) return <ShieldPlus size={16} color="white" />;
        if (cat.includes('mart') || cat.includes('store') || cat.includes('shop') || cat.includes('retail')) return <Store size={16} color="white" />;
        if (cat.includes('home') || cat.includes('residence')) return <Home size={16} color="white" />;
        if (cat.includes('office') || cat.includes('corporate') || cat.includes('work')) return <Briefcase size={16} color="white" />;
        if (cat.includes('cafe') || cat.includes('coffee') || cat.includes('restaurant')) return <Coffee size={16} color="white" />;
        if (cat.includes('gym') || cat.includes('fitness')) return <Dumbbell size={16} color="white" />;
        if (cat.includes('airport')) return <Plane size={16} color="white" />;
        return <Building size={16} color="white" />;
      };

      const isSelected = mData.id === selectedId;
      const size = mData.isActive || isSelected ? '36px' : '30px';
      const markerColor = mData.color || '#10b981';

      if (markersRef.current[mData.id]) {
        const marker = markersRef.current[mData.id];
        marker.setLngLat([mData.longitude, mData.latitude]);
        
        // Update styling if needed
        const el = marker.getElement();
        el.style.width = size;
        el.style.height = size;
        el.style.zIndex = mData.type === 'ADMIN' ? '100' : (isSelected ? '1000' : (mData.isActive ? '10' : '1'));
        
        // Re-render React content to update color/icon
        const root = (el as any)._reactRoot;
        if (root) {
          root.render(
            <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: markerColor,
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                border: isSelected ? '3px solid white' : '2px solid white',
                boxShadow: isSelected ? '0 0 15px rgba(0,0,0,0.3)' : '1px 1px 4px rgba(0,0,0,0.3)'
              }} />
              <div style={{ position: 'relative', zIndex: 10, marginTop: '-5px' }}>
                {getIconForMarker(mData.type, mData.category)}
              </div>
            </div>
          );
        }
      } else {
        const el = document.createElement('div');
        el.className = 'custom-marker-wrapper';
        el.style.width = size;
        el.style.height = size;
        el.style.cursor = 'pointer';
        el.style.zIndex = mData.type === 'ADMIN' ? '100' : (isSelected ? '1000' : (mData.isActive ? '10' : '1'));
        
        const root = createRoot(el);
        (el as any)._reactRoot = root;
        
        root.render(
          <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: markerColor,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              border: isSelected ? '3px solid white' : '2px solid white',
              boxShadow: isSelected ? '0 0 15px rgba(0,0,0,0.3)' : '1px 1px 4px rgba(0,0,0,0.3)'
            }} />
            <div style={{ position: 'relative', zIndex: 10, marginTop: '-5px' }}>
              {getIconForMarker(mData.type, mData.category)}
            </div>
          </div>
        );

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([mData.longitude, mData.latitude])
          .addTo(map.current!);

        el.addEventListener('click', () => {
          if (onMarkerClick) onMarkerClick(mData);
        });

        markersRef.current[mData.id] = marker;
      }
    });
  }, [markers, onMarkerClick]);

  return (
    <div ref={mapContainer} className="w-full h-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner" />
  );
};

export default MapComponent;
