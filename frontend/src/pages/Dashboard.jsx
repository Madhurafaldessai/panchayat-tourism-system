import React, { useState } from 'react';
import { 
  ShieldAlert, Clock, CheckCircle2, 
  TrendingUp, RefreshCw, Zap 
} from 'lucide-react';

const Dashboard = () => {
  const [reports, setReports] = useState([
    { id: 1, category: 'Waste', area: 'Central Square', score: 92, status: 'Critical', time: '2m ago' },
    { id: 2, category: 'Noise', area: 'Temple Road', score: 45, status: 'Active', time: '14m ago' },
    { id: 3, category: 'Congestion', area: 'Bus Stand', score: 81, status: 'High', time: '1h ago' },
    { id: 4, category: 'Waste', area: 'Market Gate', score: 30, status: 'Resolved', time: '3h ago' },
  ]);

  const [activeFilter, setActiveFilter] = useState('All');

  const filteredData = activeFilter === 'All' 
    ? reports 
    : reports.filter(r => r.category === activeFilter);

  const handleRefresh = () => {
    console.log("Fetching latest Panchayat data...");
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 px-2 sm:px-4 md:px-0">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Total Ingestion', val: '1,402', icon: TrendingUp, color: 'emerald' },
          { label: 'Pending Action', val: '24', icon: Clock, color: 'amber' },
          { label: 'AI Flagged (80+)', val: '7', icon: Zap, color: 'red' },
          { label: 'Efficiency', val: '94%', icon: CheckCircle2, color: 'blue' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 md:p-7 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl mb-3 md:mb-4 flex items-center justify-center bg-${kpi.color}-50 text-${kpi.color}-600 group-hover:scale-110 transition-transform`}>
              <kpi.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">{kpi.label}</p>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">{kpi.val}</h3>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {['All', 'Waste', 'Noise', 'Congestion'].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 md:px-6 py-2 rounded-2xl text-[10px] md:text-xs font-black transition-all ${
                activeFilter === cat 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button 
          onClick={handleRefresh} 
          className="p-2 md:p-3 bg-gray-50 rounded-2xl hover:bg-emerald-50 text-emerald-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 md:p-8 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-black text-gray-800 text-lg md:text-xl flex items-center gap-3">
            <ShieldAlert className="text-emerald-600" /> Live Issue Ingestion
          </h3>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              WebSocket Connected
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
           <thead>
              <tr className="bg-gray-50/50 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">
               <th className="w-[22%] px-4 md:px-8 py-4 md:py-5 text-left">Category</th>
               <th className="w-[22%] px-4 md:px-8 py-4 md:py-5 text-left">Location</th>
               <th className="w-[35%] px-4 md:px-8 py-4 md:py-5 text-left">Intelligence Score</th>
               <th className="w-[19%] px-4 md:px-8 py-4 md:py-5 text-left">Time</th>
             </tr>
           </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredData.map((report) => (
                <tr key={report.id} className="hover:bg-emerald-50/30 transition-colors cursor-pointer group">
                  
                  <td className="px-4 md:px-8 py-4 md:py-6 font-bold text-gray-700 text-sm md:text-base">
                    {report.category}
                  </td>

                  <td className="px-4 md:px-8 py-4 md:py-6 text-xs md:text-sm text-gray-500 font-medium italic">
                    {report.area}
                  </td>

                  <td className="px-4 md:px-8 py-4 md:py-6">
                    <div className="flex items-center gap-2 md:gap-4">
                      
                      <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            report.score > 80 ? 'bg-red-500' : 'bg-emerald-500'
                          }`} 
                          style={{ width: `${report.score}%` }}
                        ></div>
                      </div>

                      <span className={`text-[10px] md:text-xs font-black ${
                        report.score > 80 ? 'text-red-500' : 'text-emerald-700'
                      }`}>
                        {report.score}/100
                      </span>
                    </div>
                  </td>

                 <td className="px-8 py-6 text-left">
                  <span className="inline-block w-full font-mono text-[10px] font-black bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {report.time}
                  </span>
                </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;