import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, LogOut, Leaf, CheckCircle, ArrowRight, MapIcon, Menu, X
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Default to false on mobile, true on desktop
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  // Close sidebar automatically when clicking a link on mobile
  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: MapIcon, label: 'Heatmap', path: '/heatmap' },
    { icon: CheckCircle, label: 'Issue Solved', path: '/issues' },
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

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:w-0'} 
        fixed md:relative z-50 rounded-2xl mt-4 ml-4 h-[97vh] bg-gradient-to-b from-emerald-600 via-emerald-700 to-teal-900 
        text-white flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ease-in-out
      `}>
        <div className="p-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/30">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Citizen<span className="font-light opacity-80">Portal</span>
            </span>
          </div>
          {/* Close button for mobile */}
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
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
            onClick={() => handleNavigation('/')}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl 
                       text-emerald-100 relative overflow-hidden group
                       bg-white/5 backdrop-blur-md border border-white/10
                       hover:border-red-400/40 hover:bg-red-500/10
                       transition-all duration-300 shadow-lg"
          >
            <LogOut className="w-5 h-5 transition-all duration-500 group-hover:text-red-300" />
            <span className="font-semibold text-sm tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 md:h-20 rounded-2xl shadow-xl mt-4 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 md:px-10 shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all text-emerald-500"
            >
              {sidebarOpen ? <ArrowRight className="w-6 h-6 rotate-180" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden sm:block">
              <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Dashboard</h2>
              <p className="text-gray-900 font-bold text-sm md:text-lg truncate max-w-[150px] md:max-w-none">
                Panchayat Tourism
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 bg-gray-100/70 px-3 md:px-5 py-1.5 md:py-2 rounded-2xl border border-gray-200">
            <div className="flex flex-col items-center leading-tight">
              <span className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase">Role</span>
              <span className="text-[10px] md:text-sm font-extrabold text-emerald-700">ADMIN</span>
            </div>
            <div className="h-6 md:h-8 w-px bg-gray-300"></div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm md:text-base">
              A
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#f8fafc]">
          {/* Responsive Gradient Wrapper */}
          <div className="p-[1px] md:p-[2px] rounded-2xl md:rounded-3xl bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
            <div className="rounded-[15px] md:rounded-3xl bg-white p-4 md:p-8 min-h-[85vh]">
              {children}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;