import React from 'react';

const NavItem = ({ icon: Icon, label, isActive = false }) => {
  return (
    <div
      className={`
        flex items-center gap-3.5 px-4 py-3 rounded-lg cursor-pointer transition-colors
        ${isActive 
          ? 'bg-[#F0A441] text-[#2F3E37] font-semibold' // Active (orange)
          : 'text-slate-200/90 hover:bg-slate-700/50 hover:text-white' // Inactive
        }
      `}
    >
      <Icon className={`w-[22px] h-[22px] ${isActive ? 'stroke-[2]' : 'stroke-[1.5]'}`} />
      <span className="text-base">{label}</span>
    </div>
  );
};

export default NavItem;