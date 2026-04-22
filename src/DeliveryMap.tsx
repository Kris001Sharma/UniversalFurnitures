import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
const NEPAL_BOUNDS: [[number, number], [number, number]] = [[80.0, 26.0], [89.0, 31.0]];

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<Record<string, maplibregl.Marker>>({});
  const userMarker = useRef<maplibregl.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (map.current) return;

    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: STYLE_URL,
        center: userLocation ? [userLocation.longitude, userLocation.latitude] : [85.3240, 27.7172],
        zoom: 13,
        attributionControl: false,
        maxBounds: NEPAL_BOUNDS
      });

      map.current.addControl(new maplibregl.NavigationControl({
        showCompass: false
      }), 'top-right');

      map.current.on('load', () => {
        // Add source for route
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
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Handle Rezise
  useEffect(() => {
    const timer = setTimeout(() => {
      map.current?.resize();
    }, 100);
    return () => clearTimeout(timer);
  }, [isMapFullscreen]);

  // Handle Centering
  const lastTrigger = useRef(0);
  useEffect(() => {
    if (mapCenterTrigger !== undefined && mapCenterTrigger !== lastTrigger.current && userLocation) {
      lastTrigger.current = mapCenterTrigger;
      map.current?.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 15,
        essential: true
      });
    }
  }, [mapCenterTrigger, userLocation]);

  // Update User Marker
  useEffect(() => {
    if (!map.current) return;
    if (userLocation) {
      if (!userMarker.current) {
        userMarker.current = new maplibregl.Marker({ color: "#10b981" })
          .setLngLat([userLocation.longitude, userLocation.latitude])
          .setPopup(new maplibregl.Popup().setHTML('<strong>Your Location</strong>'))
          .addTo(map.current);
      } else {
        userMarker.current.setLngLat([userLocation.longitude, userLocation.latitude]);
      }
    }
  }, [userLocation]);

  // Update Task Markers
  useEffect(() => {
    if (!map.current) return;

    const currentTasks = navigatingTaskId ? targetTasks : optimizedTasks;
    const currentTaskIds = new Set(currentTasks.map((t: any) => t.id));

    // Remove old markers
    Object.keys(markers.current).forEach(id => {
      if (!currentTaskIds.has(id)) {
        markers.current[id].remove();
        delete markers.current[id];
      }
    });

    // Add or update markers
    currentTasks.forEach((task: any) => {
      if (task.latitude && task.longitude) {
        if (!markers.current[task.id]) {
          const el = document.createElement('div');
          el.className = 'marker';
          
          const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2 min-w-[150px]">
              <strong class="block text-sm mb-1">${task.orgName}</strong>
              <span class="block text-[10px] text-slate-500 mb-2">${task.orderId}</span>
              ${task.status === 'Open' ? `
                <button id="btn-${task.id}" class="w-full py-1.5 bg-orange-500 text-white rounded-lg text-[10px] font-bold shadow-sm hover:bg-orange-600 transition-colors">
                  Start Task
                </button>
              ` : ''}
            </div>
          `);

          // Add event listener to popup button after it's added to the DOM
          popup.on('open', () => {
            const btn = document.getElementById(`btn-${task.id}`);
            if (btn) {
              btn.addEventListener('click', () => handleStartDelivery(task.id));
            }
          });

          markers.current[task.id] = new maplibregl.Marker()
            .setLngLat([task.longitude, task.latitude])
            .setPopup(popup)
            .addTo(map.current!);
        } else {
          markers.current[task.id].setLngLat([task.longitude, task.latitude]);
        }
      }
    });
  }, [optimizedTasks, targetTasks, navigatingTaskId]);

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
          if (map.current?.getSource('route')) {
            (map.current.getSource('route') as maplibregl.GeoJSONSource).setData({
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

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
}
