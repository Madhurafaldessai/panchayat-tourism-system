/* eslint-disable react/prop-types */
import React from 'react';
import { MapPin } from 'lucide-react';

const LocationAlert = ({ message }) => {
  return (
    <div className="bg-[#FFEFEF] border border-[#FFDADA] rounded-xl p-6 flex items-start gap-4 mb-10 w-full">
      <div className="p-2.5 bg-black rounded-full border border-[#FFDADA]">
        <MapPin className="w-5 h-5 text-red-700" />
      </div>
      
      <p className="text-red-900 text-[15px] leading-relaxed flex-grow mt-0.5">
        {message}
      </p>
      
    </div>
  );
};

export default LocationAlert;