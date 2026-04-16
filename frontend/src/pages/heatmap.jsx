// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';
import { supabase } from '../supabaseClient';

// Fix Leaflet marker icons (Crucial for the markers to show up on the map)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// 🔥 Heatmap Layer Component
function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    // Radius and Blur adjusted for a cleaner "Density" look
    const heatLayer = L.heatLayer(points, {
      radius: 35, 
      blur: 20,
      maxZoom: 13,
      gradient: {
        0.2: '#22c55e', // Green (Low)
        0.5: '#eab308', // Yellow (Medium)
        0.8: '#f97316', // Orange (High)
        1.0: '#ef4444'  // Red (Critical Density)
      }
    }).addTo(map);

    return () => {
      if (map && heatLayer) map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

const Heatmap = () => {
  const [points, setPoints] = useState([]);
  const [rawMarkers, setRawMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Centered on Goa for the Panchayat project
  const goaCenter = [15.2993, 74.1240];

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetching live data from the 'reports' table
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .neq('status', 'Resolved'); // Only show active problems

      if (error) throw error;

      if (data) {
        // Filter out any entries that might have missing coordinates to prevent crashes
        const validData = data.filter(item => {
          const lat = parseFloat(item.latitude);
          const lng = parseFloat(item.longitude);
          return !isNaN(lat) && !isNaN(lng);
        });

        // Map data for Heatmap: [lat, lng, intensity]
        setPoints(
          validData.map(p => [
            parseFloat(p.latitude),
            parseFloat(p.longitude),
            (p.upvotes || 1) * 0.1 // Using upvotes as intensity multiplier
          ])
        );

        setRawMarkers(validData);
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Setup Realtime: Refresh map when any citizen reports an issue
    const channel = supabase
      .channel('reports-map-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        () => fetchData() 
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full space-y-4 font-sans">
      
      {/* Visual Dashboard Header */}
      <div className="flex justify-between items-center px-4">
        <h1 className="text-4xl font-black text-[#134e4a] tracking-tighter">
          ISSUE <span className="text-[#10b981]">HOTSPOTS</span>
        </h1>

        <div className="bg-[#134e4a] text-[#A3E635] px-6 py-2 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          {rawMarkers.length} Active Incidents
        </div>
      </div>

      {/* The Map Frame */}
      <div className="w-full h-[calc(100vh-200px)] rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-xl relative bg-slate-100">

        {loading ? (
          <div className="absolute inset-0 z-[1001] bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Mapping Incidents...</p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={goaCenter}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Render the Heatmap Glow */}
            {points.length > 0 && <HeatmapLayer points={points} />}

            {/* Individual Pins */}
            {rawMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={[parseFloat(marker.latitude), parseFloat(marker.longitude)]}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[150px]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                        {marker.category}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-800 text-sm leading-tight mb-1">{marker.title}</h4>
                    <p className="text-[#134e4a] font-bold text-[9px] uppercase tracking-tighter">
                      📍 {marker.village}, {marker.taluka}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default Heatmap;