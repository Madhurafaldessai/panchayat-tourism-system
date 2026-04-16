// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';
import { supabase } from '../supabaseClient';

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
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

    const heatLayer = L.heatLayer(points, {
      radius: 40,
      blur: 25,
      maxZoom: 10,
      gradient: {
        0.2: '#22c55e', // 🟢 Low
        0.5: '#eab308', // 🟡 Medium
        0.8: '#f97316', // 🟠 High
        1.0: '#ef4444'  // 🔴 Critical
      }
    }).addTo(map);

    return () => {
      if (map && heatLayer) map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

// 🔥 MAIN COMPONENT
const Heatmap = () => {
  const [points, setPoints] = useState([]);
  const [rawMarkers, setRawMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const goaCenter = [15.2993, 74.1240];
  const citizenVillage = localStorage.getItem('citizenVillage');

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('citizens')
        .select('*')
        .eq('village', citizenVillage)     // ✅ village filter
        .neq('status', 'Resolved');        // ✅ hide solved

      if (error) throw error;

      if (data) {
        const validData = data.filter(item => {
          const lat = parseFloat(item.latitude);
          const lng = parseFloat(item.longitude);
          return !isNaN(lat) && !isNaN(lng);
        });

        // 🔥 PRIORITY → INTENSITY
        const heatPoints = validData.map(p => {
          let intensity = 0.2;

          if (p.priority === 'Critical') intensity = 1.0;
          else if (p.priority === 'High') intensity = 0.8;
          else if (p.priority === 'Medium') intensity = 0.5;
          else intensity = 0.2;

          return [
            parseFloat(p.latitude),
            parseFloat(p.longitude),
            intensity
          ];
        });

        setPoints(heatPoints);
        setRawMarkers(validData);
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 INITIAL + REALTIME
  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('map-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'citizens' },
        () => {
          fetchData(); // 🔥 auto refresh
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center px-2">
        <h1 className="text-4xl font-black text-[#134e4a] uppercase">
          LIVE <span className="text-[#10b981]">MAP</span>
        </h1>

        <div className="flex items-center gap-3 bg-[#134e4a] text-[#A3E635] px-5 py-2 rounded-xl text-[10px] font-black">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          {rawMarkers.length} Issues
        </div>
      </div>

      {/* MAP */}
      <div className="w-full h-[calc(100vh-200px)] rounded-3xl overflow-hidden border-8 border-orange-50">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <MapContainer center={goaCenter} zoom={11} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {points.length > 0 && <HeatmapLayer points={points} />}

            {rawMarkers.map((marker, idx) => (
              <Marker
                key={idx}
                position={[parseFloat(marker.latitude), parseFloat(marker.longitude)]}
              >
                <Popup>
                  <div className="text-xs">
                    <b>{marker.category}</b><br />
                    👍 {marker.upvotes || 1}<br />
                    {marker.village}<br />
                    {marker.taluka}
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