import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
const NEPAL_BOUNDS: [[number, number], [number, number]] = [[80.0, 26.0], [89.0, 31.0]];

interface AgentMarkerData {
  id: string;
  name: string;
  role: string;
  latitude: number;
  longitude: number;
  status: string;
  duty_status: string;
}

interface AdminLogisticsMapProps {
  agents: AgentMarkerData[];
  onAgentClick: (agentId: string) => void;
  selectedAgentId: string | null;
}

export const AdminLogisticsMap = ({ agents, onAgentClick, selectedAgentId }: AdminLogisticsMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<Record<string, maplibregl.Marker>>({});

  useEffect(() => {
    if (map.current) return;

    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: STYLE_URL,
        center: [85.3240, 27.7172], // Kathmandu
        zoom: 12,
        attributionControl: false,
        maxBounds: NEPAL_BOUNDS
      });

      map.current.addControl(new maplibregl.NavigationControl({
        showCompass: false
      }), 'top-right');
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update Markers when agents change
  useEffect(() => {
    if (!map.current) return;

    const agentIds = new Set(agents.map(a => a.id));

    // Remove old markers for agents no longer in the list
    Object.keys(markers.current).forEach(id => {
      if (!agentIds.has(id)) {
        markers.current[id].remove();
        delete markers.current[id];
      }
    });

    // Add or update markers
    agents.forEach(agent => {
      if (agent.latitude && agent.longitude) {
        if (!markers.current[agent.id]) {
          const el = document.createElement('div');
          el.className = 'agent-marker';
          
          // Create custom marker element
          const markerEl = document.createElement('div');
          markerEl.className = `w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg cursor-pointer transition-all hover:scale-110 border-2 ${
            agent.role === 'SALES' ? 'bg-emerald-500 border-emerald-100' : 'bg-orange-500 border-orange-100'
          } ${selectedAgentId === agent.id ? 'ring-4 ring-rose-300 scale-110 z-50' : ''}`;
          
          markerEl.innerHTML = `<span>${(agent.name || '?').charAt(0)}</span>`;
          markerEl.onclick = () => onAgentClick(agent.id);

          markers.current[agent.id] = new maplibregl.Marker({ element: markerEl })
            .setLngLat([agent.longitude, agent.latitude])
            .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <p class="font-bold text-slate-900">${agent.name}</p>
                <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">${agent.role}</p>
                <div class="mt-2 flex items-center gap-2">
                   <div class="w-2 h-2 rounded-full ${agent.duty_status === 'On Duty' ? 'bg-emerald-500' : 'bg-slate-300'}"></div>
                   <span class="text-xs text-slate-600">${agent.duty_status}</span>
                </div>
              </div>
            `))
            .addTo(map.current!);
        } else {
          // Update position if moved
          markers.current[agent.id].setLngLat([agent.longitude, agent.latitude]);
          
          // Update styling for selection
          const el = markers.current[agent.id].getElement();
          if (selectedAgentId === agent.id) {
            el.classList.add('ring-4', 'ring-rose-300', 'scale-110', 'z-50');
          } else {
            el.classList.remove('ring-4', 'ring-rose-300', 'scale-110', 'z-50');
          }
        }
      }
    });
  }, [agents, selectedAgentId, onAgentClick]);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-inner bg-slate-100">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xl z-10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-lg bg-emerald-500 shadow-sm shadow-emerald-200"></div>
          <span className="text-xs font-bold text-slate-600">Sales Agents</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-lg bg-orange-500 shadow-sm shadow-orange-200"></div>
          <span className="text-xs font-bold text-slate-600">Delivery Agents</span>
        </div>
        <div className="h-px bg-slate-100 my-1"></div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Tracking Active</span>
        </div>
      </div>
    </div>
  );
};
