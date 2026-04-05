import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, LogOut, Leaf, CheckCircle
} from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { MapIcon } from 'lucide-react'; 

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sidebar menu items
  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: MapIcon, label: 'Heatmap', path: '/heatmap' },
    { icon: CheckCircle, label: 'Issue Solved', path: '/issues' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} bg-gradient-to-b from-emerald-600 via-emerald-700 to-teal-900 text-white flex flex-col shadow-2xl overflow-hidden transition-all duration-300`}>
        <div className="p-8 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/30">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            Citizen<span className="font-light opacity-80">Portal</span>
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive ? 'bg-white/20 shadow-lg border border-white/10 translate-x-2' : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-300' : 'text-white'}`} />
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl 
                       text-emerald-100 relative overflow-hidden group
                       bg-white/5 backdrop-blur-md border border-white/10
                       hover:border-red-400/40 hover:bg-red-500/10
                       transition-all duration-300 shadow-lg hover:shadow-red-500/20"
          >
            {/* Glow background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 
                            opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

            {/* Border glow */}
            <div className="absolute inset-0 rounded-2xl border border-transparent 
                            group-hover:border-red-400/40 transition-all duration-300"></div>

            <LogOut className="w-5 h-5 group-hover:rotate-180 group-hover:text-red-300 transition-all duration-500" />
            <span className="font-semibold text-sm tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-200 transition-all"
            >
              {sidebarOpen ? (
                <ArrowRight className="w-6 h-6 text-emerald-500 rotate-180 transition-transform duration-300" />
              ) : (
                <span className="text-emerald-500 font-bold text-2xl">☰</span>
              )}
            </button>

            <div>
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Dashboard</h2>
              <p className="text-gray-900 font-bold text-lg">Panchayat Tourism System</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-100/70 backdrop-blur-md px-5 py-2 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>

            <div className="flex flex-col items-center justify-center leading-tight">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Role
              </span>
              <span className="text-sm font-extrabold text-emerald-700 mt-0.5">
                ADMIN
              </span>
            </div>

            <div className="h-8 w-px bg-gray-300"></div>

            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-emerald-200 ring-2 ring-emerald-300/40 hover:scale-105 transition-all duration-300">
              A
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]">
          <div className="p-[2px] rounded-3xl bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
            <div className="rounded-3xl bg-white p-8 min-h-[80vh]">
              {children}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;