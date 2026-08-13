import React, { useState, useEffect } from 'react';
import { Award, Plus, Search, ShieldCheck } from 'lucide-react';
import { fetchCertificates } from '../../../services/features/certificateService';
import CertificateTableRoster from './components/CertificateTableRoster';
import GenerateCertificateModal from './components/GenerateCertificateModal';

export default function CertificateManagementPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  const loadCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetchCertificates({ search: searchQuery });
      setCertificates(res.data || []);
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, [searchQuery]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Certificate Management</h1>
          <p className="text-xs text-slate-500">Issue official completion certificates and track verification statuses</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or name..."
              className="w-full pl-8 pr-3 h-9 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition"
            />
          </div>

          <button
            onClick={() => setIsGenerateOpen(true)}
            className="px-4 h-9 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Issue Certificate
          </button>
        </div>
      </div>

      <CertificateTableRoster certificates={certificates} loading={loading} />

      <GenerateCertificateModal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        onSuccess={loadCertificates}
      />

    </div>
  );
}