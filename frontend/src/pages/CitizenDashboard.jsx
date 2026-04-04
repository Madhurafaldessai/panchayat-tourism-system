// @ts-nocheck
import React, { useState } from 'react';
import { Camera, MapPin, Upload, CheckCircle2 } from 'lucide-react';

const CitizenDashboard = () => {
  const [image, setImage] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Function to capture Geo-location
  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6)
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      getGeoLocation(); // Automatically trigger geo-tagging on upload
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-emerald-100 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Report Submitted!</h2>
        <p className="text-gray-500 mb-8">The Panchayat has been notified. Thank you for keeping our tourism zones clean.</p>
        <button onClick={() => setSubmitted(false)} className="text-emerald-600 font-bold hover:underline">Report another issue</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-50 rounded-[2.5rem] shadow-xl border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image Upload Area */}
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`aspect-video rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all ${image ? 'border-emerald-500' : 'border-gray-200 group-hover:border-emerald-300 bg-gray-50'}`}>
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover rounded-[1.9rem]" />
              ) : (
                <>
                  <Camera className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-sm font-bold text-gray-400">Tap to Take Photo</p>
                  <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-1">Camera will Geo-Tag automatically</p>
                </>
              )}
            </div>
          </div>

          {/* Location Feedback */}
          <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <div className="bg-emerald-500 p-2 rounded-lg text-white">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Automatic Geo-Tag</p>
              <p className="text-xs text-emerald-600 font-medium">
                {location.lat ? `${location.lat}, ${location.lng}` : "Awaiting location access..."}
              </p>
            </div>
          </div>

          {/* Issue Details */}
          <div className="space-y-4">
            <select className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
              <option>Select Issue Category</option>
              <option>Waste / Garbage</option>
              <option>Noise Pollution</option>
              <option>Traffic Congestion</option>
              <option>Illegal Construction</option>
            </select>

            <textarea 
              placeholder="Describe the issue... (Optional)"
              className="w-full px-6 py-4 bg-gray-50 hover:bg-emerald-50 border-none rounded-2xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 hover:ring-2 hover:ring-emerald-400 transition-all min-h-[120px]"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading || !image}
            className={`w-full py-5 rounded-2xl font-black text-sm tracking-widest shadow-lg transition-all active:scale-95 ${loading || !image ? 'bg-gray-300 text-gray-400' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'}`}
          >
            {loading ? "PROCESSING..." : "SUBMIT REPORT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CitizenDashboard;