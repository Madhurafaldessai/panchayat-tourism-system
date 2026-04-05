// @ts-nocheck
import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  MessageSquare, 
  AlertCircle 
} from 'lucide-react';

const CitizenDashboard = () => {
  const [image, setImage] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({
          lat: pos.coords.latitude.toFixed(6).toString(),
          lng: pos.coords.longitude.toFixed(6).toString()
        });
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      getGeoLocation();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-12 rounded-[3rem] shadow-2xl border border-emerald-100 text-center animate-in zoom-in duration-500 max-w-md mx-auto">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Success!</h2>
        <p className="text-gray-500 font-medium mb-8">The Panchayat has received your report. Together we keep the village clean!</p>
        <button 
          onClick={() => {setSubmitted(false); setImage(""); setLocation({lat:"", lng:""});}} 
          className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-md"
        >
          New Report
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Visual Header within Content */}
      <div className="mb-9 rounded-3xl bg-zinc-300 h-20  shadow-2xl border border-black-100 text-white text-center">
        <h1 className="text-2xl font-black mt-6 text-gray-800">REPORT   ISSUE</h1>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] p-8 shadow-2xl border border-gray">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Enhanced Image Capture Area */}
          <div className="relative group overflow-hidden rounded-[2.5rem] border-2 border-dashed border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 transition-all cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              onChange={handleImageUpload} 
              className="absolute inset-0 opacity-0 cursor-pointer z-20" 
            />
            <div className="aspect-video md:aspect-[21/9] flex flex-col items-center justify-center pointer-events-none p-4">
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover rounded-2xl shadow-inner" />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8 text-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-sm font-black text-emerald-800 tracking-tight">Tap to Photo</p>
                  <p className="text-[10px] text-emerald-600/60 uppercase font-bold mt-1 tracking-widest">Auto Geo-Tagging Enabled</p>
                </div>
              )}
            </div>
          </div>

          {/* Geo-Tag Visualization */}
          <div className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${location.lat ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-gray-100'}`}>
            <div className={`p-3 rounded-xl shadow-sm ${location.lat ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-red-500 drop-shadow-md'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Geographical Signature</p>
              <p className={`text-sm font-bold ${location.lat ? 'text-emerald-700' : 'text-gray-400'}`}>
                {location.lat ? `${location.lat} N, ${location.lng} E` : "Awaiting Signal..."}
              </p>
            </div>
            {location.lat && <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />}
          </div>

          {/* Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Selection */}
            <div className="relative">
              <AlertCircle className="absolute left-4 top-4 w-5 h-5 text-emerald-600/40" />
              <select required className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer shadow-inner">
                <option value="">Issue Category</option>
                <option>Waste Management</option>
                <option>Water Infrastructure</option>
                <option>Traffic / Congestion</option>
                <option>Noise Control</option>
              </select>
            </div>

            {/* Title / Short Desc */}
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-emerald-600/40" />
              <input 
                type="text" 
                placeholder="Brief Title (e.g. Broken Pipe)" 
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
              />
            </div>
          </div>

          <textarea 
            placeholder="Detailed description of the issue..."
            className="w-full p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-emerald-500 transition-all min-h-[140px] shadow-inner"
          ></textarea>

          {/* Action Button */}
          <button 
            type="submit" 
            disabled={loading || !image}
            className={`w-full py-5 rounded-2xl font-black text-sm tracking-[0.2em] transition-all relative overflow-hidden group shadow-xl ${
              loading || !image 
                ? 'bg-gray-100 text-zinc-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:scale-[1.02] active:scale-95 shadow-emerald-200'
            }`}
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-white" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                TRANSMIT REPORT <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            )}
          </button>
        </form>
      </div>
      
      {/* Footer Note */}
      <p className="text-center text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-widest px-10">
        
      </p>
    </div>
  );
};

export default CitizenDashboard;