// @ts-nocheck
import React, { useState } from 'react';
import { ShieldCheck, Camera, Layers, CheckCircle, LogOut, UserCircle, Menu, X } from 'lucide-react';

const CitizenDashboardLayout = ({ children, activeNav, setActiveNav, userName }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NAV_ITEMS = [
    { name: 'Report Issue', icon: Camera },
    { name: 'My Activity', icon: Layers },
    { name: 'Solved Issues', icon: CheckCircle },
  ];

  // LOGOUT HANDLER: Clears the persistent session
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear(); // Wipes Name, Village, Taluka, etc.
      window.location.href = "/panchayat-tourism-system/"; // Forces redirect to login via App.jsx
    }
  };

  const handleNavClick = (name) => {
    setActiveNav(name);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex font-sans text-slate-900 overflow-x-hidden">
      
      {/* SIDEBAR */}
      <div className={`
        fixed inset-y-0 left-0 w-72 bg-emerald-600 p-8 flex flex-col text-white z-[60] shadow-2xl transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:flex
      `}>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-6 right-6 p-2 bg-emerald-700 rounded-lg"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-10 pb-4 border-b border-emerald-500/50">
          <div className="p-2.5 bg-white/10 rounded-xl"><ShieldCheck size={26} /></div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">CitizenPortal</h1>
        </div>
        
        <nav className="flex-1 space-y-3">
          {NAV_ITEMS.map(item => (
            <button 
              key={item.name} 
              onClick={() => handleNavClick(item.name)} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold tracking-tight text-sm transition-all ${activeNav === item.name ? 'bg-white text-emerald-700 shadow-xl' : 'hover:bg-emerald-500'}`}
            >
              <item.icon size={18} /> {item.name}
            </button>
          ))}
        </nav>

        {/* UPDATED LOGOUT BUTTON */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 mt-auto px-6 py-4 bg-emerald-700 rounded-xl font-bold text-sm text-emerald-100 hover:bg-emerald-800 transition-all active:scale-95"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* CONTENT AREA */}
      <div className="flex-1 w-full md:ml-72 flex flex-col min-w-0">
        <header className="fixed top-0 right-0 left-0 md:left-72 bg-[#F4F7F6]/90 backdrop-blur-md z-40 p-5 md:p-8 flex justify-between items-center border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 bg-white rounded-lg border hover:bg-slate-50 active:scale-95 transition-all"
            >
              <Menu size={20} className="text-emerald-600" />
            </button>
            <h2 className="text-lg md:text-3xl font-black tracking-tighter text-slate-800 uppercase truncate">
              {activeNav}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 p-1.5 md:p-2.5 bg-white rounded-2xl border shadow-sm">
            <UserCircle className="text-emerald-600" size={24} />
            <div className="hidden sm:block text-left">
              {/* Dynamic Name from LocalStorage */}
              <p className="font-black text-slate-800 text-[12px] tracking-tighter leading-none">
                {userName || "Guest User"}
              </p>
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mt-1">
                Verified • {localStorage.getItem('citizenVillage') || 'Goa'}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-12 pt-24 md:pt-32 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CitizenDashboardLayout;