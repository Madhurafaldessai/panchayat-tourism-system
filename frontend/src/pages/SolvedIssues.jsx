// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CheckCircle, Calendar, User, MapPin, Search, FileText } from 'lucide-react';

const SolvedIssues = () => {
  const [solvedIssues, setSolvedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Get Admin's village from localStorage
  const adminVillage = localStorage.getItem('adminVillage');

  useEffect(() => {
    fetchSolvedIssues();
  }, [adminVillage]);

  const fetchSolvedIssues = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('citizens')
        .select('*')
        .eq('village', adminVillage)
        .eq('status', 'Resolved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSolvedIssues(data || []);
    } catch (err) {
      console.error("Error fetching solved issues:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = solvedIssues.filter(issue => 
    issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Solved Issues Record</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
            Historical data for <span className="text-emerald-600">{adminVillage}</span>
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Search solved reports..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-4">Retrieving Archives...</p>
        </div>
      ) : filteredIssues.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Issue Image */}
                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-50">
                  <img src={issue.image_url} alt={issue.title} className="w-full h-full object-cover" />
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                        {issue.category}
                      </span>
                      <h3 className="text-lg font-black text-gray-900 tracking-tight mt-1 uppercase">{issue.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      <CheckCircle size={14} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Solved</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{issue.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <User size={14} className="text-emerald-600" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-600">{issue.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={14} className="text-emerald-600" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-600">
                        {new Date(issue.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 col-span-2">
                      <MapPin size={14} className="text-emerald-600" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-600">{issue.village}, {issue.taluka}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
          <FileText className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-gray-900 font-black text-lg uppercase tracking-tight">No solved records found</h3>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Issues marked as resolved will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default SolvedIssues;