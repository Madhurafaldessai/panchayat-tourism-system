// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';
import { supabase } from '../supabaseClient';

<<<<<<< HEAD
// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
=======
// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
>>>>>>> 732deb2a640531c5e30b4430aa5d706ef8cc4527
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

<<<<<<< HEAD
// 🔥 Heatmap Layer Component
=======
// 🔥 Heatmap Layer
>>>>>>> 732deb2a640531c5e30b4430aa5d706ef8cc4527
function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius: 40,
      blur: 25,
      maxZoom: 10,
      gradient: {
<<<<<<< HEAD
        0.2: '#22c55e', // 🟢 Low
        0.5: '#eab308', // 🟡 Medium
        0.8: '#f97316', // 🟠 High
        1.0: '#ef4444'  // 🔴 Critical
=======
        0.4: '#10b981',
        0.7: '#059669',
        1.0: '#134e4a'
>>>>>>> 732deb2a640531c5e30b4430aa5d706ef8cc4527
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

<<<<<<< HEAD
  // 🔥 FETCH DATA
=======
  // 🔥 FETCH DATA (ONLY ACTIVE ISSUES)
>>>>>>> 732deb2a640531c5e30b4430aa5d706ef8cc4527
  const fetchData = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
<<<<<<< HEAD
        .from('citizens')
        .select('*')
        .eq('village', citizenVillage)     // ✅ village filter
        .neq('status', 'Resolved');        // ✅ hide solved
=======
        .from('reports') // ✅ correct table
        .select('*')
        .neq('status', 'Resolved'); // ✅ remove resolved
>>>>>>> 732deb2a640531c5e30b4430aa5d706ef8cc4527

      if (error) throw error;

      if (data) {
        const validData = data.filter(item => {
          const lat = parseFloat(item.latitude);
          const lng = parseFloat(item.longitude);
          return !isNaN(lat) && !isNaN(lng);
        });

<<<<<<< HEAD
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
=======
        // Heatmap points
        setPoints(
          validData.map(p => [
            parseFloat(p.latitude),
            parseFloat(p.longitude),
            (p.upvotes || 1) * 0.2
          ])
        );

        // Markers
>>>>>>> 732deb2a640531c5e30b4430aa5d706ef8cc4527
        setRawMarkers(validData);
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // 🔥 INITIAL + REALTIME
=======
  // 🔥 INITIAL LOAD + REALTIME
>>>>>>> 732deb2a640531c5e30b4430aa5d706ef8cc4527
  useEffect(() => {
    fetchData();

    const channel = supabase
<<<<<<< HEAD
      .channel('map-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'citizens' },
=======
      .channel('reports-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
>>>>>>> 732deb2a640531c5e30b4430aa5d706ef8cc4527
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
<<<<<<< HEAD
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
=======
      
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <h1 className="text-4xl font-black text-[#134e4a] uppercase">
          LIVE <span className="text-[#10b981]">MAP!</span>
        </h1>

        <div className="flex items-center gap-3 bg-[#134e4a] text-[#A3E635] px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase shadow-xl">
          <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
          {rawMarkers.length} Active Issues
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-[calc(100vh-220px)] rounded-[3rem] overflow-hidden border-[11px] border-orange-50 shadow-2xl relative">

        {loading ? (
          <div className="absolute inset-0 z-[1001] bg-white flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
>>>>>>> 732deb2a640531c5e30b4430aa5d706ef8cc4527
          </div>
        ) : (
          <MapContainer
            center={goaCenter}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

<<<<<<< HEAD
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
=======
            {/* Heatmap */}
            {points.length > 0 && <HeatmapLayer points={points} />}

            {/* Markers */}
            {rawMarkers.map((marker, idx) => (
              <Marker
                key={idx}
                position={[
                  parseFloat(marker.latitude),
                  parseFloat(marker.longitude)
                ]}
              >
                <Popup>
                  <div className="p-1 min-w-[120px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">
                        {marker.category}
                      </span>
                      <span className="text-emerald-900 font-black text-xs">
                        👍 {marker.upvotes || 1}
                      </span>
                    </div>
                    <p className="text-[#134e4a] font-bold text-[10px]">
                      {marker.village}
                    </p>
                    <p className="text-gray-400 text-[8px] uppercase">
                      {marker.taluka}
                    </p>
>>>>>>> 732deb2a640531c5e30b4430aa5d706ef8cc4527
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