// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Home, Shield, Key, Leaf, ChevronDown } from 'lucide-react';
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
    adminId: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const citizenName = localStorage.getItem('citizenName');
    const adminId = localStorage.getItem('adminId');
    // Using navigate ensuring we stay within the HashRouter system
    if (citizenName) navigate('/CitizenDashboard');
    else if (adminId) navigate('/dashboard');
  }, [navigate]);

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

  const validate = () => {
    let newErrors = {};
    if (role === "citizen") {
      if (!formData.name) newErrors.name = "Name required";
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) newErrors.phone = "Enter valid 10 digit phone";
      if (!formData.taluka) newErrors.taluka = "Select taluka";
      if (!formData.village) newErrors.village = "Select village";
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
      const { data, error } = await supabase
        .from('citizens')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            taluka: formData.taluka,
            village: formData.village
          }
        ])
        .select();

      setLoading(false);

      if (error) {
        console.error(error);
        alert("Error saving citizen data");
        return;
      }

      // store minimal session
      localStorage.setItem('citizenName', data[0].name);
      localStorage.setItem('citizenVillage', data[0].village);

      // --- FIXED: Replaced window.location.href with navigate ---
      navigate('/CitizenDashboard');
    } else {
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
      
      localStorage.setItem('adminVillage', data.village);
      localStorage.setItem('adminId', data.admin_id);
      
      // --- FIXED: Replaced window.location.href with navigate ---
      navigate('/dashboard');
    }
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-900 p-4 font-sans text-gray-800">
      <div 
        className="w-full max-w-md bg-emerald-700/30 backdrop-blur-lg rounded-[3rem] p-10 border border-white/10"
        style={{ boxShadow: '20px 20px 60px #112d24, -20px -20px 60px #2b6d58' }}
      >
        <div className="text-center mb-10">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-emerald-600"
            style={{ boxShadow: 'inset 6px 6px 12px #184437, inset -6px -6px 12px #266c57' }}
          >
            <Leaf className="text-emerald-300 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">Panchayat Portal</h1>
          <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest mt-2 opacity-80">Tourism Management System</p>
        </div>

        <div className="flex mb-8 bg-emerald-800/40 rounded-2xl p-2 shadow-[inset_4px_4px_8px_#112d24,inset_-4px_-4px_8px_#2b6d58]">
          <button
            type="button"
            onClick={() => setRole("citizen")}
            className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
              role === "citizen" 
              ? "bg-emerald-500 text-white shadow-[4px_4px_10px_#112d24]" 
              : "text-emerald-400/50 hover:text-emerald-200"
            }`}
          >
            Citizen
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
              role === "admin" 
              ? "bg-emerald-500 text-white shadow-[4px_4px_10px_#112d24]" 
              : "text-emerald-400/50 hover:text-emerald-200"
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {role === "citizen" && (
            <>
              <Input icon={<User size={18}/>} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} error={errors.name} />
              <Input icon={<Phone size={18}/>} name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} error={errors.phone} />
              
              <div className="grid grid-cols-2 gap-4">
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
              <Input icon={<Shield size={18}/>} name="adminId" placeholder="Admin ID" value={formData.adminId} onChange={handleChange} error={errors.adminId} />
              <Input icon={<Key size={18}/>} name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} error={errors.password} />
            </>
          )}

          <button 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-5 rounded-2xl mt-4 font-black tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 text-[13px] uppercase"
            style={{ boxShadow: '6px 6px 15px #112d24, -6px -6px 15px #2b6d58' }}
          >
            {loading ? "PROCESSING..." : "PROCEED"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ icon, error, ...props }) => (
  <div className="w-full">
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-300/50 group-focus-within:text-emerald-300 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-14 pr-5 py-4 bg-emerald-800/30 rounded-2xl outline-none text-white font-bold text-xs placeholder:text-white transition-all shadow-[inset_4px_4px_8px_#112d24,inset_-4px_-4px_8px_#2b6d58] border border-transparent focus:border-emerald-500/50"
      />
    </div>
    {error && <p className="text-orange-400 text-[9px] font-black mt-2 ml-4 uppercase tracking-widest">{error}</p>}
  </div>
);

const SelectBox = ({ icon, options, placeholder, error, disabled, ...props }) => (
  <div className="w-full">
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300/50 group-focus-within:text-emerald-300 transition-colors z-10">
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <select
        {...props}
        disabled={disabled}
        className={`w-full pl-12 pr-10 py-4 bg-emerald-800/30 rounded-2xl outline-none text-xs font-black text-white appearance-none shadow-[inset_4px_4px_8px_#112d24,inset_-4px_-4px_8px_#2b6d58] border border-transparent focus:border-emerald-500/50 ${disabled ? 'opacity-30 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
      >
        <option value="" className="bg-emerald-900">{placeholder}</option>
        {options.map(opt => <option key={opt} value={opt} className="bg-emerald-900">{opt}</option>)}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-emerald-300/50 pointer-events-none" />
    </div>
    {error && <p className="text-orange-400 text-[9px] font-black mt-2 ml-2 uppercase tracking-widest">{error}</p>}
  </div>
);

export default LoginPage;