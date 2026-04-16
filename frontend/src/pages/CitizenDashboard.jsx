// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Loader2, Target } from 'lucide-react';
import { supabase } from '../supabaseClient';
import CitizenDashboardLayout from '../layouts/CitizenDashboardLayout';

const CitizenDashboard = () => {
  const [activeNav, setActiveNav] = useState('Report Issue');
  const [reports, setReports] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Get logged in user info from localStorage
  const citizenName = localStorage.getItem('citizenName') || 'Guest User';
  const citizenVillage = localStorage.getItem('citizenVillage') || 'Unknown';
  const citizenPhone = localStorage.getItem('citizenPhone') || '';
  const citizenTaluka = localStorage.getItem('citizenTaluka') || '';

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [formData, setFormData] = useState({ category: "", title: "", description: "" });

  useEffect(() => {
    fetchMyReports();
    // Listening for changes to the table to update UI in real-time
    const channel = supabase.channel('c-updates').on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => fetchMyReports()).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const fetchMyReports = async () => {
    // We only want to see reports from OUR village
const { data } = await supabase
  .from('reports')
  .select('*')
  .eq('village', citizenVillage)
  .order('created_at', { ascending: false });    
  if (data) setReports(data);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => setLocation({ lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !imageFile) return alert("Category and Image are required!");
    
    setUploading(true);
    try {
      const fileName = `issue-${Date.now()}.jpg`;
      await supabase.storage.from('resolutions').upload(fileName, imageFile);
      const { data: { publicUrl } } = supabase.storage.from('resolutions').getPublicUrl(fileName);

      // POINT 1 & 2: Use dynamic data from login instead of hardcoded strings
      await supabase.from('reports').insert([{
        name: citizenName,
        phone: citizenPhone,
        taluka: citizenTaluka,
        village: citizenVillage,
        category: formData.category,
        title: formData.title || "Untitled Incident",
        description: formData.description || "No description provided.",
        latitude: parseFloat(location.lat || 0),
        longitude: parseFloat(location.lng || 0),
        image_url: publicUrl, 
        status: 'Pending'
      }]);

      alert("Transmission successful.");
      setActiveNav('My Activity');
      fetchMyReports();
      
      // Clear form after success
      setImagePreview("");
      setImageFile(null);
      setFormData({ category: "", title: "", description: "" });
    } catch (err) { alert(err.message); } finally { setUploading(false); }
  };

  const renderContent = () => {
    if (activeNav === 'My Activity' || activeNav === 'Solved Issues') {
      const displayData = activeNav === 'Solved Issues' ? reports.filter(r => r.status === 'Resolved') : reports;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
          {displayData.map(r => (
            <div key={r.id} className="bg-white p-5 md:p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between w-full">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest">{r.category}</span>
                  <span className={`px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase border ${r.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>{r.status}</span>
                </div>
                <h3 className="font-black text-md md:text-lg tracking-tighter mb-2">{r.title}</h3>
                <p className="text-slate-500 text-[11px] md:text-xs font-medium mb-4 line-clamp-3">{r.description}</p>
              </div>
              {r.resolution_proof && (
                <div className="mt-2 rounded-2xl overflow-hidden border-2 border-emerald-100">
                  <p className="bg-emerald-50 p-2 text-[8px] md:text-[9px] font-black text-emerald-700 flex items-center gap-2 uppercase tracking-tighter"><Target size={12}/> Official Proof</p>
                  <img src={r.resolution_proof} alt="Proof" className="w-full h-32 md:h-40 object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="w-full max-w-xl mx-auto bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-50">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
          <div className="aspect-video w-full rounded-2xl md:rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden relative flex items-center justify-center">
            <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
            {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" /> : <div className="text-center text-slate-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest"><Camera className="mx-auto mb-2 opacity-20" size={32} /> Snap Photo</div>}
          </div>
          <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Select Category (Required)</option>
            <option value="Garbage">Garbage</option>
            <option value="Road Issue">Road Issue</option>
            <option value="Water/Elec">Water/Elec</option>
          </select>
          <input type="text" value={formData.title} placeholder="Title (Optional)" onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl font-bold text-xs outline-none" />
          <textarea value={formData.description} placeholder="Description (Optional)" onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl font-bold text-xs outline-none h-24 md:h-32 resize-none" />
          <div className="flex items-center gap-3 p-3 md:p-4 bg-emerald-50/50 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black text-emerald-700 tracking-widest uppercase">
            <MapPin size={14} /> {location.lat ? `${location.lat}, ${location.lng}` : "GPS Awaiting..."}
          </div>
          <button disabled={uploading} className="w-full py-4 md:py-5 bg-emerald-600 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs tracking-widest hover:bg-emerald-700 shadow-lg disabled:opacity-50">
            {uploading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "TRANSMIT INCIDENT"}
          </button>
        </form>
      </div>
    );
  };

  return (
    <CitizenDashboardLayout activeNav={activeNav} setActiveNav={setActiveNav} userName={citizenName}>
      {renderContent()}
    </CitizenDashboardLayout>
  );
};

export default CitizenDashboard;