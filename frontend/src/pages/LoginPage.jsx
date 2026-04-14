// @ts-nocheck
import React, { useState } from 'react';
import { User, Phone, MapPin, Home, Shield, Key, Leaf, AlertCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient";

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("citizen");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    taluka: '',
    village: '',
    category: '', 
    adminId: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  // All 12 Goa Talukas with major Tourism Villages
  const talukas = [
    "Bardez", "Tiswadi", "Salcete", "Ponda", "Mormugao", 
    "Bicholim", "Pernem", "Sattari", "Quepem", "Sanguem", 
    "Canacona", "Dharbandora"
  ];

  const villages = {
    Bardez: ["Calangute", "Candolim", "Anjuna", "Arpora", "Mapusa", "Aldona"],
    Tiswadi: ["Panaji", "Old Goa", "Dona Paula", "Taleigao", "Bambolim"],
    Salcete: ["Margao", "Colva", "Benaulim", "Cavelossim", "Majorda"],
    Ponda: ["Ponda City", "Mardol", "Priol", "Curti", "Bandora"],
    Mormugao: ["Vasco da Gama", "Bogmalo", "Sancoale", "Chicalim"],
    Bicholim: ["Bicholim City", "Mayem", "Sanquelim", "Maem Lake"],
    Pernem: ["Arambol", "Morjim", "Mandrem", "Querim", "Pernem City"],
    Sattari: ["Valpoi", "Keri", "Honda", "Pissurlem"],
    Quepem: ["Balli","Fatorpa","Curchorem", "Paroda", "Rivona"],
    Sanguem: ["Sanguem City", "Netravali", "Uguem", "Kalay"],
    Canacona: ["Palolem", "Agonda", "Patnem", "Canacona City", "Loliem"],
    Dharbandora: ["Mollem", "Collem", "Sacorda", "Sancordem"]
  };

  const categoryWeights = {
    "Garbage": 0.9,
    "Road Issue": 0.8,
    "Water/Elec": 0.6,
    "Tourism": 0.4,
    "Suggestion": 0.2
  };

  const validate = () => {
    let newErrors = {};
    if (role === "citizen") {
      if (!formData.name) newErrors.name = "Name required";
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) newErrors.phone = "Enter valid 10 digit phone";
      if (!formData.taluka) newErrors.taluka = "Select taluka";
      if (!formData.village) newErrors.village = "Select village";
      if (!formData.category) newErrors.category = "Select category";
    } else {
      if (!formData.adminId) newErrors.adminId = "Admin ID required";
      if (!formData.password) newErrors.password = "Password required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    if (role === "citizen") {
      if (!navigator.geolocation) {
        alert("Geolocation not supported.");
        saveCitizenData(null, null);
      } else {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Check for nearby duplicates
            const { data: existingIssues } = await supabase
              .from('citizens')
              .select('id, category, upvotes')
              .eq('category', formData.category)
              .gte('latitude', latitude - 0.0008)
              .lte('latitude', latitude + 0.0008)
              .gte('longitude', longitude - 0.0008)
              .lte('longitude', longitude + 0.0008)
              .limit(1);

            if (existingIssues && existingIssues.length > 0) {
              const issue = existingIssues[0];
              const confirmUpvote = window.confirm(
                `A similar ${formData.category} issue has already been reported nearby. Would you like to upvote it instead?`
              );

              if (confirmUpvote) {
                await supabase
                  .from('citizens')
                  .update({ upvotes: (issue.upvotes || 1) + 1 })
                  .eq('id', issue.id);

                setLoading(false);
                alert("Upvote registered!");
                navigate('/CitizenDashboard');
                return;
              }
            }
            saveCitizenData(latitude, longitude);
          },
          () => {
            alert("Location access denied.");
            setLoading(false);
          }
        );
      }
    } else {
      // ADMIN LOGIN LOGIC
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('admin_id', formData.adminId)
        .eq('password', formData.password)
        .single();

      setLoading(false);
      if (error || !data) {
        alert("Invalid Admin Credentials");
        return;
      }

      // Store Admin info including their Village and Taluka
      localStorage.setItem('adminVillage', data.village);
      localStorage.setItem('adminId', data.admin_id);
      
      alert(`Login successful for ${data.village} Panchayat!`);
      navigate('/dashboard'); 
    }
  };

  const saveCitizenData = async (lat, lng) => {
    const intensityValue = categoryWeights[formData.category] || 0.5;
    
    const { error } = await supabase
      .from('citizens')
      .insert([{
        name: formData.name,
        phone: formData.phone,
        taluka: formData.taluka,
        village: formData.village,
        category: formData.category,
        latitude: lat,
        longitude: lng,
        intensity: intensityValue,
        upvotes: 1
      }]);

    setLoading(false);
    if (error) {
      alert("Error saving data.");
      return;
    }

    alert("Citizen data saved!");
    navigate('/CitizenDashboard');
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-700 to-teal-900 p-4 font-sans text-gray-800">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl">
        
        <div className="text-center mb-6">
          <div className="bg-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-emerald-900 tracking-tighter uppercase leading-tight">Panchayat Portal</h1>
          <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest mt-1 opacity-60">Tourism Management System</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-2xl p-1 border border-gray-200">
          <button
            type="button"
            onClick={() => setRole("citizen")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${role === "citizen" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-400"}`}
          >
            Citizen
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${role === "admin" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-400"}`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === "citizen" && (
            <>
              <Input icon={<User />} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} error={errors.name} />
              <Input icon={<Phone />} name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} error={errors.phone} />
              
              <div className="relative">
                <AlertCircle className="absolute left-4 top-3.5 w-5 h-5 text-emerald-600/50" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-12 pr-8 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none appearance-none font-medium text-gray-700 focus:border-emerald-500 transition-all text-sm"
                >
                  <option value="">Issue Category</option>
                  {Object.keys(categoryWeights).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                {errors.category && <p className="text-red-500 text-[10px] font-bold mt-1 ml-4 uppercase">{errors.category}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectBox icon={<MapPin />} name="taluka" value={formData.taluka} onChange={handleChange} options={talukas} placeholder="Taluka" error={errors.taluka} />
                <SelectBox 
                  icon={<Home />} 
                  name="village" 
                  value={formData.village} 
                  onChange={handleChange} 
                  options={formData.taluka ? villages[formData.taluka] : []} 
                  placeholder="Village" 
                  error={errors.village} 
                  disabled={!formData.taluka}
                />
              </div>
            </>
          )}

          {role === "admin" && (
            <>
              <Input icon={<Shield />} name="adminId" placeholder="Admin ID" value={formData.adminId} onChange={handleChange} error={errors.adminId} />
              <Input icon={<Key />} name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} error={errors.password} />
            </>
          )}

          <button 
            disabled={loading}
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-4 rounded-2xl mt-4 font-black tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50 text-xs"
          >
            {loading ? "PROCESSING..." : "PROCEED"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ icon, error, ...props }) => (
  <div>
    <div className="relative">
      <div className="absolute left-4 top-3.5 text-emerald-600/50">{icon}</div>
      <input
        {...props}
        className="w-full pl-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium text-sm"
      />
    </div>
    {error && <p className="text-red-500 text-[10px] font-bold mt-1 ml-4 uppercase">{error}</p>}
  </div>
);

const SelectBox = ({ icon, options, placeholder, error, disabled, ...props }) => (
  <div>
    <div className="relative">
      <div className="absolute left-3 top-3.5 text-emerald-600/50">{React.cloneElement(icon, { size: 18 })}</div>
      <select
        {...props}
        disabled={disabled}
        className={`w-full pl-10 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-sm font-medium text-gray-700 ${disabled ? 'opacity-50' : 'opacity-100'}`}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
    {error && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase">{error}</p>}
  </div>
);

export default LoginPage;