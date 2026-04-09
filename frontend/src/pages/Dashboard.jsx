import React, { useState } from 'react';
import { 
  ShieldAlert, Clock, CheckCircle2, 
  TrendingUp, RefreshCw, MapPin, 
  ArrowUpRight, Trash2, HardHat, 
  Droplets, Leaf
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Reports State 
  const [reports] = useState([
    { id: 1, category: 'Sanitation & Waste', area: 'Central Square', score: 92, status: 'Critical', time: '2m ago' },
    { id: 2, category: 'Roads & Infrastructure', area: 'Main Highway', score: 85, status: 'High', time: '45m ago' },
    { id: 3, category: 'Water Issues', area: 'Sector 4 Pipeline', score: 40, status: 'Stable', time: '1h ago' },
    { id: 4, category: 'Environmental Concerns', area: 'Green Belt', score: 30, status: 'Resolved', time: '3h ago' },
  ]);

  // Recent Investigations Section
  const [investigations] = useState([
    { id: 'INV-101', title: 'Open Drainage Overflow — Ward 4', category: 'Sanitation & Waste', status: 'Pending', priority: 'Critical', assignee: 'Village Clean Team', time: '30m ago' },
    { id: 'INV-102', title: 'Major Pothole on School Road', category: 'Roads & Infrastructure', status: 'Active', priority: 'High', assignee: 'Panchayat Engineer', time: '2h ago' },
    { id: 'INV-103', title: 'Main Water Tank Leakage', category: 'Water Issues', status: 'Active', priority: 'Critical', assignee: 'Water Dept', time: '4h ago' },
    { id: 'INV-104', title: 'Illegal Garbage Dumping near Pond', category: 'Environmental Concerns', status: 'Resolved', priority: 'Medium', assignee: 'Gram Sevak', time: '6h ago' },
  ]);

  const [activeFilter, setActiveFilter] = useState('All');

  const trendData = [
    { name: 'Jan', Waste: 400, Roads: 300, Water: 240 },
    { name: 'Mar', Waste: 510, Roads: 350, Water: 260 },
    { name: 'Jun', Waste: 620, Roads: 410, Water: 340 },
    { name: 'Sep', Waste: 710, Roads: 460, Water: 380 },
    { name: 'Dec', Waste: 850, Roads: 530, Water: 420 },
  ];

  const categories = ['All', 'Sanitation & Waste', 'Roads & Infrastructure', 'Water Issues', 'Environmental Concerns'];

  const filteredData = activeFilter === 'All' 
    ? reports 
    : reports.filter(r => r.category === activeFilter);

  const getIcon = (cat) => {
    switch(cat) {
      case 'Sanitation & Waste': return <Trash2 size={22} />;
      case 'Roads & Infrastructure': return <HardHat size={22} />;
      case 'Water Issues': return <Droplets size={22} />;
      case 'Environmental Concerns': return <Leaf size={22} />;
      default: return <ShieldAlert size={22} />;
    }
  };

  const StatusBadge = ({ type, text }) => {
    const styles = {
      Pending: 'bg-orange-50 text-orange-600 border-orange-100',
      Active: 'bg-blue-50 text-blue-600 border-blue-100',
      Resolved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      Critical: 'text-rose-600 font-black',
      High: 'text-orange-600 font-black',
      Medium: 'text-blue-600 font-black',
    };

    if (type === 'priority') {
      return (
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full bg-current ${styles[text]}`} />
          <span className={`text-[14px] font-black ${styles[text]}`}>{text}</span>
        </div>
      );
    }
    return (
      <span className={`px-4 py-1.5 rounded-full text-[12px] font-black uppercase border ${styles[text]}`}>
        {text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] p-6 md:p-12 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Ingestion', val: '1,402', icon: TrendingUp },
            { label: 'Pending Action', val: '24', icon: Clock },
            { label: 'Efficiency', val: '94%', icon: CheckCircle2 },
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center bg-emerald-600 text-white">
                <kpi.icon size={28} />
              </div>
              <p className="text-slate-400 text-[12px] font-black uppercase tracking-widest mb-1">{kpi.label}</p>
              <h3 className="text-4xl font-black text-slate-800">{kpi.val}</h3>
            </div>
          ))}
        </div>

        {/* Charts & Metrics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Issue Trends Chart */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white">
            <h3 className="text-[22px] font-black mb-8">Issue Trends</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#065f46" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#065f46" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 14, fontWeights: 900, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 14, fontWeights: 900, fill: '#94a3b8'}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Waste" stroke="#065f46" fillOpacity={1} fill="url(#colorWaste)" strokeWidth={4} />
                  <Area type="monotone" dataKey="Roads" stroke="#10b981" fillOpacity={0} strokeWidth={4} />
                  <Area type="monotone" dataKey="Water" stroke="#34d399" fillOpacity={0} strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Efficiency Metrics (Gauge View) */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white">
            <h3 className="text-[22px] font-black mb-10">Efficiency Metrics</h3>
            <div className="grid grid-cols-2 gap-10">
              {[
                { label: 'Resolution Rate', val: 87, target: 90 },
                { label: 'Response Time', val: 92, target: 85 },
                { label: 'Investigation Closure', val: 74, target: 80 },
                { label: 'Citizen Satisfaction', val: 81, target: 85 },
              ].map((m, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                      <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" 
                        strokeDasharray={301} strokeDashoffset={301 - (301 * m.val) / 100}
                        className={m.val >= m.target ? 'text-emerald-600' : 'text-orange-400'}
                      />
                    </svg>
                    <span className="absolute text-2xl font-black italic">{m.val}%</span>
                  </div>
                  <p className="text-[13px] font-black text-slate-700 mt-5 text-center uppercase">{m.label}</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1">Target: {m.target}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investigation Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-white overflow-hidden">
          <div className="p-10 border-b border-slate-50">
            <h3 className="text-[24px] font-black mb-1">Recent Investigations</h3>
            <p className="text-[14px] text-slate-400 font-bold uppercase tracking-wider">Panchayat Action Registry</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-10 py-6">Issue ID</th>
                  <th className="px-10 py-6">Subject</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6">Priority</th>
                  <th className="px-10 py-6">Assigned To</th>
                  <th className="px-10 py-6 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {investigations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-10 py-7 text-[14px] font-black text-emerald-700">{inv.id}</td>
                    <td className="px-10 py-7">
                      <div className="flex flex-col">
                        <span className="text-[18px] font-black text-slate-800">{inv.title}</span>
                        <span className="text-[12px] text-slate-400 font-bold uppercase mt-1 italic">{inv.category}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7"><StatusBadge text={inv.status} /></td>
                    <td className="px-10 py-7"><StatusBadge type="priority" text={inv.priority} /></td>
                    <td className="px-10 py-7 text-[16px] text-slate-600 font-black">{inv.assignee}</td>
                    <td className="px-10 py-7 text-right text-[13px] text-slate-400 font-black italic">{inv.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 bg-white/50 p-3 rounded-3xl border border-white backdrop-blur-md">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-8 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all ${
                activeFilter === cat 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'text-slate-500 hover:bg-white bg-white/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Issue Stream */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-white overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-[26px] font-black flex items-center gap-4">
              <ShieldAlert className="text-emerald-600" size={32} /> Live Issue Stream
            </h2>
            <div className="flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-full">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[13px] font-black uppercase text-emerald-700">Live Feed</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-10 py-8">Incident Type</th>
                  <th className="px-10 py-8">Location</th>
                  <th className="px-10 py-8">Intelligence Score</th>
                  <th className="px-10 py-8 text-right">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
                          {getIcon(report.category)}
                        </div>
                        <span className="font-black text-slate-800 text-[18px]">{report.category}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-slate-500 font-bold italic text-[16px]">
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="opacity-40" />
                        {report.area}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-40 bg-slate-100 h-3 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${report.score > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${report.score}%` }}
                          />
                        </div>
                        <span className="text-[15px] font-black">{report.score}/100</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="inline-flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-xl text-[12px] font-black uppercase italic">
                        {report.time} <ArrowUpRight size={20} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;