// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js'; 
import { supabase } from '../supabaseClient';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function HeatmapLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    // Added an extra safety check for points
    if (!map || !points || points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius: 40,
      blur: 25,
      maxZoom: 10,
      gradient: { 0.4: '#10b981', 0.7: '#059669', 1.0: '#134e4a' }
    }).addTo(map);

    return () => { if (map && heatLayer) map.removeLayer(heatLayer); };
  }, [map, points]);
  return null;
}

const Heatmap = () => {
  const [points, setPoints] = useState([]);
  const [rawMarkers, setRawMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const goaCenter = [15.2993, 74.1240];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('citizens').select('*');
        
        if (error) throw error;
        
        if (data) {
          // --- STRICT FILTERING FOR NaN VALUES ---
          const validData = data.filter(item => {
            const lat = parseFloat(item.latitude);
            const lng = parseFloat(item.longitude);
            // Only allow items where BOTH lat and lng are valid numbers
            return !isNaN(lat) && !isNaN(lng);
          });

          setPoints(validData.map(p => [
            parseFloat(p.latitude), 
            parseFloat(p.longitude), 
            parseFloat((p.upvotes || 1) * 0.2) 
          ]));
          
          setRawMarkers(validData);
        }
      } catch (err) {
        console.error("Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      <div className="flex justify-between items-center px-2 shrink-0">
        <h1 className="text-4xl font-black text-[#134e4a] tracking-tighter uppercase leading-none">
          LIVE <span className="text-[#10b981]">MAP!</span>
        </h1>
        
        <div className="flex items-center gap-3 bg-[#134e4a] text-[#A3E635] px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
           <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-2xl"></div>
           {rawMarkers.length} Valid Nodes
        </div>
      </div>

      <div className="w-full h-[calc(100vh-220px)] rounded-[3rem] overflow-hidden border-[11px] border-orange-50 dropshadow-2xl relative bg-emerald-50/10">
        {loading ? (
          <div className="absolute inset-0 z-[1001] bg-white flex items-center justify-center shadow-2xl">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <MapContainer center={goaCenter} zoom={11} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Render Heatmap only if we have valid points */}
            {points.length > 0 && <HeatmapLayer points={points} />}

            {/* Render Markers only if coordinates are valid */}
            {rawMarkers.map((marker, idx) => (
              <Marker key={idx} position={[parseFloat(marker.latitude), parseFloat(marker.longitude)]}>
                <Popup>
                  <div className="p-1 min-w-[120px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">
                        {marker.category}
                      </span>
                      <span className="text-emerald-900 font-black text-xs">👍 {marker.upvotes || 1}</span>
                    </div>
                    <p className="text-[#134e4a] font-bold text-[10px]">{marker.village}</p>
                    <p className="text-gray-400 text-[8px] uppercase tracking-tighter">{marker.taluka}</p>
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