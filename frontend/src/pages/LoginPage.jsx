// @ts-nocheck
import React, { useState } from 'react';
import { User, Phone, MapPin, Home, Shield, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("citizen");

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    taluka: '',
    village: '',
    adminId: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  // Goa Talukas & Villages 
  const talukas = ["Bardez", "Tiswadi", "Salcete"];

  const villages = {
    Bardez: ["Mapusa", "Calangute", "Anjuna"],
    Tiswadi: ["Panaji", "Chimbel", "Taleigao"],
    Salcete: ["Margao", "Colva", "Benaulim"]
  };

  const validate = () => {
    let newErrors = {};

    if (role === "citizen") {
      if (!formData.name) newErrors.name = "Name required";

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Enter valid 10 digit phone";
      }

      if (!formData.taluka) newErrors.taluka = "Select taluka";
      if (!formData.village) newErrors.village = "Select village";
    } else {
      if (!formData.adminId) newErrors.adminId = "Admin ID required";
      if (!formData.password) newErrors.password = "Password required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      if (role === "citizen") {
        navigate('/CitizenDashboard');
      } else {
        navigate('/Dashboard');
      }
    }
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-700 to-teal-900 p-4">
      
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl">

        {/* Role Toggle */}
        <div className="flex mb-6 bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setRole("citizen")}
            className={`flex-1 py-2 rounded-xl ${role === "citizen" ? "bg-white shadow" : ""}`}
          >
            Citizen
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 rounded-xl ${role === "admin" ? "bg-white shadow" : ""}`}
          >
            Admin
          </button>
        </div>

        <h1 className="text-center text-xl font-bold mb-6">LOGIN</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* CITIZEN FORM */}
          {role === "citizen" && (
            <>
              <Input icon={<User />} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} error={errors.name} />

              <Input icon={<Phone />} name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} error={errors.phone} />

              {/* Taluka Dropdown */}
              <div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <select
                    name="taluka"
                    value={formData.taluka}
                    onChange={handleChange}
                    className="w-full pl-12 py-3 bg-gray-100 rounded-2xl outline-none"
                  >
                    <option value="">Select Taluka</option>
                    {talukas.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                {errors.taluka && <p className="text-red-500 text-xs ml-4">{errors.taluka}</p>}
              </div>

              {/* Village Dropdown */}
              <div>
                <div className="relative">
                  <Home className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <select
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    className="w-full pl-12 py-3 bg-gray-100 rounded-2xl outline-none"
                  >
                    <option value="">Select Village</option>
                    {formData.taluka &&
                      villages[formData.taluka]?.map(v => (
                        <option key={v}>{v}</option>
                      ))}
                  </select>
                </div>
                {errors.village && <p className="text-red-500 text-xs ml-4">{errors.village}</p>}
              </div>
            </>
          )}

          {/* ADMIN FORM */}
          {role === "admin" && (
            <>
              <Input icon={<Shield />} name="adminId" placeholder="Admin ID" value={formData.adminId} onChange={handleChange} error={errors.adminId} />

              <Input icon={<Key />} name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} error={errors.password} />
            </>
          )}

          <button className="w-full bg-black text-white py-4 rounded-2xl mt-4">
            PROCEED
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Component
const Input = ({ icon, ...props }) => (
  <div>
    <div className="relative">
      <div className="absolute left-4 top-3.5 text-gray-400">{icon}</div>
      <input
        {...props}
        className="w-full pl-12 py-3 bg-gray-100 rounded-2xl outline-none"
      />
    </div>
    {props.error && <p className="text-red-500 text-xs ml-4">{props.error}</p>}
  </div>
);

export default LoginPage;
