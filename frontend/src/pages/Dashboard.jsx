// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Clock, CheckCircle2, 
  TrendingUp, MapPin, 
  Trash2, HardHat, 
  Droplets, Leaf, UserCheck, CheckCircle, Eye
} from 'lucide-react';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const [investigations, setInvestigations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const adminVillage = localStorage.getItem('adminVillage') || 'Unknown';

  const fetchIssues = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('citizens')
      .select('*')
      .eq('village', adminVillage)
      .order('created_at', { ascending: false });

    if (!error) setInvestigations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchIssues();
  }, [adminVillage]);

  // Logic for the Urgent "Red" UI
  const pendingCount = investigations.filter(i => i.status !== 'Resolved').length;
  const unassignedCount = investigations.filter(i => i.assigned_to === 'Unassigned' && i.status !== 'Resolved').length;

  const handleAssign = async (id) => {
    const assignee = window.prompt("Enter department/staff for assignment (e.g., Clean Team, Engineer):");
    if (!assignee) return;

    const { error } = await supabase
      .from('citizens')
      .update({ assigned_to: assignee, status: 'Active' })
      .eq('id', id);

    if (!error) fetchIssues();
  };

  const handleSolve = async (id) => {
    const proof = window.prompt("STRICT REQUIREMENT: Enter PROOF of resolution (e.g., 'Fixed on 14/04, photo link: [URL]'):");
    
    if (!proof) {
      alert("ACTION DENIED: You must provide proof to mark an issue as solved.");
      return;
    }

    const { error } = await supabase
      .from('citizens')
      .update({ 
        status: 'Resolved',
        resolution_proof: proof 
      })
      .eq('id', id);

    if (!error) {
      alert("Issue successfully resolved and archived with proof.");
      fetchIssues();
    }
  };

  const getIcon = (cat) => {
    switch(cat) {
      case 'Garbage': return <Trash2 size={22} />;
      case 'Road Issue': return <HardHat size={22} />;
      case 'Water/Elec': return <Droplets size={22} />;
      case 'Tourism': return <Leaf size={22} />;
      default: return <ShieldAlert size={22} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] p-6 md:p-12 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">
              {adminVillage} <span className="text-emerald-600">Panchayat</span>
            </h1>  
          </div>
          <button onClick={fetchIssues} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:rotate-180 transition-all duration-700">
            <TrendingUp className="text-emerald-600" />
          </button>
        </div>

        {/* KPI Section with Pressure UI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Urgent Issues Card - Turns RED if count > 0 */}
          <div className={`p-10 rounded-[2.5rem] shadow-2xl border transition-all duration-500 ${pendingCount > 0 ? 'bg-red-500 text-white border-rose-700 shadow-2xl scale-105' : 'bg-white text-slate-800 border-white'}`}>
            <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center ${pendingCount > 0 ? 'bg-white text-rose-600' : 'bg-emerald-600 text-white'}`}>
              <ShieldAlert size={28} />
            </div>
            <p className={`${pendingCount > 0 ? 'text-red-100' : 'text-slate-400'} text-[12px] font-black uppercase tracking-widest mb-1`}>Urgent Action Required</p>
            <h3 className="text-5xl font-black ">{pendingCount}</h3>
          </div>

          {/* Unassigned Card - Turns Orange/Red if assignments are missing */}
          <div className={`p-10 rounded-[2.5rem] shadow-sm border transition-all duration-500 ${unassignedCount > 0 ? 'bg-orange-500 text-white border-orange-600 shadow-lg' : 'bg-white text-slate-800 border-white'}`}>
            <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center ${unassignedCount > 0 ? 'bg-white text-orange-500' : 'bg-emerald-600 text-white'}`}>
              <Clock size={28} />
            </div>
            <p className={`${unassignedCount > 0 ? 'text-orange-50' : 'text-slate-400'} text-[12px] font-black uppercase tracking-widest mb-1`}>Unassigned Reports</p>
            <h3 className="text-5xl font-black ">{unassignedCount}</h3>
          </div>

          {/* Solved Card - Stays Emerald */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white text-slate-800">
            <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center bg-emerald-600 text-white">
              <CheckCircle2 size={28} />
            </div>
            <p className="text-slate-400 text-[12px] font-black uppercase tracking-widest mb-1">Successfully Resolved</p>
            <h3 className="text-5xl font-black text-emerald-600">
              {investigations.filter(i => i.status === 'Resolved').length}
            </h3>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-white overflow-hidden">
          <div className="p-10 border-b border-slate-50">
            <h3 className="text-[24px] font-black">Issue Action Registry</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-10 py-6">Citizen Details</th>
                  <th className="px-10 py-6">Complaint Type</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6">Official Proof</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {investigations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-7">
                      <div className="flex flex-col">
                        <span className="text-[16px] font-black text-slate-800">{inv.name}</span>
                        <span className="text-[12px] text-slate-400 font-bold">{inv.phone}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">{getIcon(inv.category)}</div>
                        <span className="text-[16px] font-black text-slate-800">{inv.category}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                        inv.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse'
                      }`}>
                        {inv.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-10 py-7">
                      {inv.resolution_proof ? (
                        <div className="group relative">
                          <span className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-lg w-fit cursor-help">
                            <Eye size={14} /> View Proof
                          </span>
                          <div className="absolute hidden group-hover:block bottom-full mb-2 p-3 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl w-64 z-10">
                            <strong>Note:</strong> {inv.resolution_proof}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs italic">Awaiting Action</span>
                      )}
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleAssign(inv.id)}
                          className="p-3 bg-slate-100 hover:bg-emerald-100 text-slate-600 rounded-xl transition-all"
                        >
                          <UserCheck size={18} />
                        </button>
                        {inv.status !== 'Resolved' && (
                          <button 
                            onClick={() => handleSolve(inv.id)}
                            className="p-3 bg-rose-100 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
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