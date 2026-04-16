// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Clock, CheckCircle2, 
  TrendingUp, 
  Trash2, HardHat, 
  Droplets, Leaf, UserCheck, Eye, Upload
} from 'lucide-react';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const [investigations, setInvestigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Get Village from Storage
  const adminVillage = localStorage.getItem('adminVillage') || 'Unknown';

  const fetchIssues = async () => {
    if (adminVillage === 'Unknown') return;
    setLoading(true);

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('village', adminVillage)
      .order('created_at', { ascending: false });

    if (!error) {
      setInvestigations(data || []);
    } else {
      console.error("Supabase Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIssues();

    // Real-time Subscription
    const channel = supabase
      .channel('admin-updates')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'reports' }, 
        () => {
          fetchIssues(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [adminVillage]);

  // FIX: Safely calculate counts after data is fetched
  const pendingCount = investigations ? investigations.filter(i => i.status !== 'Resolved').length : 0;
  const unassignedCount = investigations ? investigations.filter(i => (i.assigned_to === 'Unassigned' || !i.assigned_to) && i.status !== 'Resolved').length : 0;
  const resolvedCount = investigations ? investigations.filter(i => i.status === 'Resolved').length : 0;

  const handleAssign = async (id) => {
    const assignee = window.prompt("Enter department/staff for assignment:");
    if (!assignee) return;
    
    const { error } = await supabase
      .from('reports')
      .update({ assigned_to: assignee, status: 'Active' })
      .eq('id', id);

    if (error) alert("Assignment failed");
    fetchIssues();
  };

  const handleUploadAndSolve = async (id) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      const fileName = `proof-${id}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('resolutions')
        .upload(fileName, file);

      if (uploadError) {
        alert("Upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('resolutions')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('reports')
        .update({ 
          status: 'Resolved',
          resolution_proof: publicUrl 
        })
        .eq('id', id);

      setUploading(false);
      if (!dbError) {
        alert("Issue resolved with image proof!");
        fetchIssues();
      }
    };

    fileInput.click();
  };

  const getIcon = (cat) => {
    switch(cat) {
      case 'Garbage': return <Trash2 size={20} />;
      case 'Road Issue': return <HardHat size={20} />;
      case 'Water/Elec': return <Droplets size={20} />;
      case 'Tourism': return <Leaf size={20} />;
      default: return <ShieldAlert size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] p-6 md:p-10 text-slate-900 font-sans">
      {uploading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-white border-t-rose-500 rounded-full animate-spin mb-4"></div>
          <p className="text-white font-black uppercase tracking-[0.3em] text-sm animate-pulse">Uploading Proof...</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
              {adminVillage} <span className="text-emerald-600">Panchayat</span>
            </h1>
          </div>
          <button onClick={fetchIssues} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 hover:rotate-180 transition-all duration-700">
            <TrendingUp className="text-emerald-600" size={20} />
          </button>
        </div>

        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${pendingCount > 0 ? 'bg-red-500 text-white shadow-xl scale-[1.02]' : 'bg-white'}`}>
            <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${pendingCount > 0 ? 'bg-white text-red-600' : 'bg-emerald-600 text-white'}`}>
              <ShieldAlert size={22} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Urgent Action</p>
            <h3 className="text-3xl font-black">{pendingCount}</h3>
          </div>

          <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${unassignedCount > 0 ? 'bg-orange-500 text-white shadow-lg' : 'bg-white'}`}>
            <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${unassignedCount > 0 ? 'bg-white text-orange-500' : 'bg-emerald-600 text-white'}`}>
              <Clock size={22} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Unassigned</p>
            <h3 className="text-3xl font-black">{unassignedCount}</h3>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
            <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-emerald-600 text-white">
              <CheckCircle2 size={22} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Resolved</p>
            <h3 className="text-3xl font-black text-emerald-600">{resolvedCount}</h3>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2rem] shadow-2xl border border-white overflow-hidden">
          <div className="p-8 border-b border-slate-50">
            <h3 className="text-[20px] font-black">Issue Action Registry</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-8 py-5">Citizen</th>
                  <th className="px-8 py-5">Issue Type</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-center">Official Proof</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {investigations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-black text-slate-800">{inv.name}</span>
                        <span className="text-[11px] text-slate-400 font-bold">{inv.phone}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">{getIcon(inv.category)}</div>
                        <span className="text-[15px] font-black text-slate-800">{inv.category}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                        inv.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse'
                      }`}>
                        {inv.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {inv.resolution_proof ? (
                        <a href={inv.resolution_proof} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-emerald-700 font-bold text-[10px] bg-emerald-50 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-all">
                          <Eye size={14} /> VIEW PHOTO
                        </a>
                      ) : (
                        <span className="text-slate-300 text-[10px] italic">Awaiting Action</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleAssign(inv.id)} className="p-2.5 bg-slate-100 hover:bg-emerald-100 text-slate-600 rounded-xl transition-all" title="Assign Team"><UserCheck size={16} /></button>
                        {inv.status !== 'Resolved' && (
                          <button onClick={() => handleUploadAndSolve(inv.id)} className="p-2.5 bg-rose-100 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all flex items-center gap-2 font-black text-[9px] px-4">
                            <Upload size={14} /> RESOLVE
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {investigations.length === 0 && !loading && (
                <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                    No incidents reported in {adminVillage}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;