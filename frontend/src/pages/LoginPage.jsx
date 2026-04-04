// @ts-nocheck
import React, { useState } from 'react';
import { User, Phone, MapPin, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  // 1. State for data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    pincode: ''
  });

  // 2. State for errors
  const [errors, setErrors] = useState({
    name: '',  
    phone: '',
    village: '',
    pincode: ''
  });

  // 3. Validation Logic
  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }

    if (!formData.village.trim()) newErrors.village = "Village name is required";

    const pinRegex = /^[0-9]{6}$/;
    if (!pinRegex.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit PIN code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. Submit Handler
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      console.log("Data is valid! Moving to Dashboard...");
      navigate('/dashboard');
    } else {
      console.log("Validation failed:", errors);
    }
  };

  // 5. Change Handler
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-700 to-teal-900 p-4">
      {/* Main Glass Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl border border-white/20">
        
        {/* Text Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">LOGIN</h1>
          <p className="text-gray-500 text-sm leading-relaxed">Enter your details</p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text" 
                placeholder="Full Name" 
                className={`w-full pl-12 pr-4 py-3 bg-gray-100/50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400 ${errors.name ? 'ring-2 ring-red-500' : ''}`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-4">{errors.name}</p>}
          </div>

          {/* Phone Field */}
          <div>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel" 
                placeholder="Phone Number" 
                className={`w-full pl-12 pr-4 py-3 bg-gray-100/50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400 ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-[10px] mt-1 ml-4">{errors.phone}</p>}
          </div>

          {/* Village Field */}
          <div>
            <div className="relative">
              <Home className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                name="village"
                value={formData.village}
                onChange={handleChange}
                type="text" 
                placeholder="Village Name" 
                className={`w-full pl-12 pr-4 py-3 bg-gray-100/50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400 ${errors.village ? 'ring-2 ring-red-500' : ''}`}
              />
            </div>
            {errors.village && <p className="text-red-500 text-[10px] mt-1 ml-4">{errors.village}</p>}
          </div>

          {/* Pincode Field */}
          <div>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                type="text" 
                placeholder="PIN Code" 
                className={`w-full pl-12 pr-4 py-3 bg-gray-100/50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400 ${errors.pincode ? 'ring-2 ring-red-500' : ''}`}
              />
            </div>
            {errors.pincode && <p className="text-red-500 text-[10px] mt-1 ml-4">{errors.pincode}</p>}
          </div>

          <button type="submit" className="w-full bg-[#1a1a1a] hover:bg-black text-white font-semibold py-4 rounded-2xl mt-4 shadow-lg active:scale-[0.98] transition-transform">
            PROCEED
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dotted border-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;