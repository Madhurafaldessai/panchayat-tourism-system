import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  PlusCircle, 
  Map as MapIcon, 
  CheckCircle, 
  LogOut, 
  Leaf 
} from 'lucide-react';

const CitizenDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: PlusCircle, label: 'Report Issue', path: '/citizen/report' },
    { icon: MapIcon, label: 'Heatmap', path: '/citizen/heatmap' },
    { icon: CheckCircle, label: 'Issues Solved', path: '/citizen/solved' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Citizen Sidebar: Emerald Gradient */}
      <aside className="w-64 bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-800 text-white flex flex-col shadow-2xl">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/30">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Citizen<span className="font-light opacity-80">Portal</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20 shadow-lg border border-white/10' 
                    : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-300' : 'text-white'}`} />
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-red-500/10 text-emerald-100 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm">Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-10">
          <h2 className="text-gray-800 font-extrabold text-xl tracking-tight">
            {menuItems.find(i => i.path === location.pathname)?.label || 'Citizen Dashboard'}
          </h2>
        </header>

        <section className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CitizenDashboardLayout;