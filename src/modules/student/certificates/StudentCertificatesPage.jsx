import React, { useState, useEffect } from 'react';
import { Award, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { fetchCertificates, downloadCertificatePDF } from '../../../services/features/certificateService';

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCertificates()
      .then((res) => setCertificates(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (certId) => {
    try {
      await downloadCertificatePDF(certId);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF certificate.");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Earned Course Certificates</h1>
        <p className="text-xs text-slate-500">Official certificates issued upon successful course completion</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-bold text-slate-400">Loading certificates...</div>
      ) : certificates.length === 0 ? (
        <div className="py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
          <Award className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-600">No Certificates Earned Yet</p>
          <p className="text-[11px] text-slate-400">Complete your course modules to receive official certificates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((c) => (
            <div key={c.certificate_id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-indigo-600">{c.certificate_id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> Valid
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{c.course_name}</h3>
                <p className="text-xs text-slate-500">Issued to: <span className="font-bold text-slate-800">{c.student_name}</span></p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 font-mono">
                  Issued: <span className="font-bold text-slate-800">{c.issue_date}</span>
                </div>
                <button
                  onClick={() => handleDownload(c.certificate_id)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}