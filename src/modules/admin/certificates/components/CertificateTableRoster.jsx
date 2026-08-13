import React from 'react';
import { Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { downloadCertificatePDF } from '../../../../services/features/certificateService';

export default function CertificateTableRoster({ certificates = [], loading }) {
  const handleDownload = async (certId) => {
    try {
      await downloadCertificatePDF(certId);
    } catch (err) {
      console.error("Failed to download certificate:", err);
      alert("Failed to download certificate PDF.");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
          <tr>
            <th className="p-4">Certificate ID</th>
            <th className="p-4">Student</th>
            <th className="p-4">Course</th>
            <th className="p-4">Completion Date</th>
            <th className="p-4">Grade</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {loading ? (
            <tr><td colSpan="7" className="p-8 text-center text-slate-400 font-semibold">Loading certificates...</td></tr>
          ) : certificates.length === 0 ? (
            <tr><td colSpan="7" className="p-8 text-center text-slate-400 font-semibold">No certificates issued yet.</td></tr>
          ) : (
            certificates.map((c) => (
              <tr key={c.certificate_id} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-4 font-mono font-bold text-indigo-600">{c.certificate_id}</td>
                <td className="p-4">
                  <div className="font-bold text-slate-900">{c.student_name}</div>
                  <div className="text-[10px] text-slate-400">{c.student_email}</div>
                </td>
                <td className="p-4 font-bold text-slate-800">{c.course_name}</td>
                <td className="p-4 font-mono text-slate-600">{c.completion_date}</td>
                <td className="p-4 font-mono font-bold text-slate-700">{c.grade_achieved}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> Valid
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDownload(c.certificate_id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}