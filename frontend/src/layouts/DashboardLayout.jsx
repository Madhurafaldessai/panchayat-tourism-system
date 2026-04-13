// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, LogOut, Leaf, CheckCircle, ArrowRight, MapIcon, Menu, X
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: MapIcon, label: 'Heatmap', path: '/dashboard/heatmap' }, 
    { icon: CheckCircle, label: 'Issue Solved', path: '/dashboard/issues' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        ${sidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:w-0'} 
        fixed md:relative z-50 rounded-2xl mt-4 ml-4 h-[96vh] bg-gradient-to-b from-emerald-600 via-emerald-700 to-teal-900 
        text-white flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ease-in-out
      `}>
        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/30">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Admin<span className="font-light opacity-80">Portal</span>
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-6 h-6 text-white/50 hover:text-white" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            // Updated active logic: Matches exact path or nested sub-paths
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-white/20 shadow-lg border border-white/10 translate-x-1' 
                    : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-emerald-300' : 'text-white/60 group-hover:text-white'}`} />
                <span className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-white/80'}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-6 border-t border-white/10">
          <button 
            onClick={() => handleNavigation('/')}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-emerald-100 bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400" />
            <span className="font-semibold text-sm tracking-wide group-hover:text-red-100">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 md:h-20 rounded-2xl shadow-xl mt-4 mx-4 bg-white/80 backdrop-blur-md border border-gray-100 flex items-center justify-between px-4 md:px-10 shrink-0 z-10">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 rounded-xl hover:bg-emerald-50 text-emerald-600 transition-colors"
            >
              {sidebarOpen ? <ArrowRight className="w-6 h-6 rotate-180" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="hidden sm:block">
              <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-none">Management Console</h2>
              <p className="text-gray-900 font-black text-lg tracking-tighter">Panchayat Tourism</p>
            </div>
          </div>

          {/* Role Badge */}
          <div className="flex items-center gap-4 bg-emerald-50/50 px-4 py-2 rounded-2xl border border-emerald-100">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-emerald-600 font-black uppercase tracking-tighter">Authorized Access</span>
              <span className="text-sm font-black text-[#1D3E31]">ADMINISTRATOR</span>
            </div>
            <div className="h-8 w-px bg-emerald-200/50"></div>
            <div className="w-10 h-10 bg-[#1D3E31] rounded-xl flex items-center justify-center text-[#A3E635] font-black shadow-lg">A</div>
          </div>
        </header>

        {/* Content Container */}
        <section className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="p-[1px] rounded-[2.5rem] bg-gradient-to-br from-emerald-400/20 via-blue-400/20 to-purple-400/20">
            <div className="rounded-[2.4rem] bg-white p-6 md:p-10 min-h-[85vh] shadow-sm">
              {children}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;