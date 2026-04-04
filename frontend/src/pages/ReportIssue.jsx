import React from 'react';
import { Camera, Image as Gallery, MapPin, Target } from 'lucide-react';
import LocationAlert from '../components/LocationAlert';

/* eslint-disable react/prop-types */ // This line will remove the red squiggly for the whole file
const ActionButton = ({ icon: Icon, label }) => (
  <button className="flex items-center justify-center gap-2.5 bg-[#F5F7FA] hover:bg-[#EDF1F6] text-slate-800 rounded-xl py-4 px-6 flex-1 transition border border-[#E6EAF0]">
    <Icon className="w-5 h-5 text-slate-600" />
    <span className="font-semibold text-base">{label}</span>
  </button>
);

const ReportIssue = () => {
  return (
    <div className="max-w-[700px] w-full">
      {/* Title & Description */}
      <h1 className="text-4xl font-bold text-slate-950 mb-4 tracking-tight">Report an Issue</h1>
      <p className="text-[#6C7A87] text-base leading-relaxed mb-8">
        Take a photo — AI will auto-detect the issue type, severity, and details.
      </p>

      {/* Location Alert Section */}
      <LocationAlert message="Could not get location. Please enable GPS and try again." />

      {/* Dotted Upload Box */}
      <div className="border-[2.5px] border-dashed border-[#D1D9E0] rounded-3xl p-10 py-12 flex flex-col items-center justify-center text-center mb-10 bg-white">
        <div className="w-20 h-20 bg-[#EDF1F6] rounded-2xl flex items-center justify-center border border-[#D1D9E0] mb-8">
          <Camera className="w-10 h-10 text-green-800 stroke-[1.5]" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Take or Upload a Photo</h3>
        <p className="text-slate-600 text-[15px] mb-6 leading-relaxed">
          AI will instantly identify the issue
        </p>
        <div className="flex items-center gap-2 text-sm text-[#6C7A87] bg-[#F5F7FA] px-4 py-1.5 rounded-full border border-[#D1D9E0]">
          <Target className="w-4 h-4 text-green-700" />
          <span className="font-medium">Geotagged automatically</span>
        </div>
      </div>

      <div className="flex gap-5 w-full">
        <ActionButton icon={Camera} label="Camera" />
        <ActionButton icon={Gallery} label="Gallery" />
      </div>
    </div>
  );
};

export default ReportIssue;