import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, MapPin, AlertCircle, 
  BarChart3, Settings, LogOut, Leaf 
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: MapPin, label: 'Hotspots', path: '/hotspots' },
    { icon: AlertCircle, label: 'Reported Issues', path: '/issues' },
    { icon: BarChart3, label: 'Trends', path: '/trends' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar: Matching the Login Page Gradient */}
      <aside className="w-72 bg-gradient-to-b from-emerald-600 via-emerald-700 to-teal-900 text-white flex flex-col shadow-2xl">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/30">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Panchayat<span className="font-light opacity-80">Sync</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20 shadow-lg border border-white/10 translate-x-2' 
                    : 'hover:bg-white/5 opacity-70 hover:opacity-100'
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
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-red-500/20 text-emerald-100 hover:text-white transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-10">
          <div>
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Dashboard</h2>
            <p className="text-gray-900 font-bold text-lg">Panchayat Intelligence System</p>
          </div>
          <div className="flex items-center gap-4 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
            <div className="px-4 py-1 text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Role</p>
              <p className="text-sm font-black text-emerald-700">ADMIN</p>
            </div>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-emerald-200">
              M
            </div>
          </div>
        </header>

        {/* This is where Dashboard.jsx will be rendered */}
        <section className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]">
          {children}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;