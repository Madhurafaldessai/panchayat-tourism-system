import React from 'react';
import { LayoutGrid, MapPin, AlertCircle, BarChart3, Radio } from 'lucide-react';
import NavItem from '../components/NavItem';

// Sidebar navigation items data
const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutGrid },
  { path: '/live-map', label: 'Live Map', icon: MapPin },
  { path: '/issues', label: 'Issues', icon: AlertCircle },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/report', label: 'Report Issue', icon: Radio }, // Icon closest to original
];

const DashboardLayout = ({ children, activeRoute }) => {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar - Exact Colors & Spacing */}
      <aside className="w-[280px] bg-[#2F3E37] flex flex-col pt-4 pb-6 px-4 shrink-0 border-r border-[#3a4d44]">
        {/* Top Section - Logo & Title */}
        <div className="flex items-center gap-3.5 pl-2 mb-10 mt-1">
          <img 
            src="/logo.png" // Place the exact logo file in your 'public' folder
            alt="Leaf Logo" 
            className="w-12 h-12 bg-[#F0A441] p-1.5 rounded-full"
          />
          <div>
            <h1 className="text-slate-50 font-semibold text-lg leading-tight">Panchayat TIS</h1>
            <p className="text-slate-300 text-xs mt-0.5">Tourism Intelligence</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5 flex-grow">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              isActive={item.path === activeRoute}
            />
          ))}
        </nav>
      </aside>

      {/* Main Content Area - White background and wide padding */}
      <main className="flex-grow bg-white px-16 py-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;