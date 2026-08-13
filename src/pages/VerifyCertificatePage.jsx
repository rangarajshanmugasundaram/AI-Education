import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Calendar, 
  User, 
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { verifyCertificate } from '../services/features/certificateService';

export default function VerifyCertificatePage() {
  const navigate = useNavigate();
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [errorMessage, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setLoading(true);
    setVerificationResult(null);
    setError('');

    try {
      const response = await verifyCertificate(certId.trim());
      if (response && response.valid) {
        setVerificationResult(response.data);
      } else {
        setError(response?.message || 'Invalid or unrecognized Certificate ID.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Certificate ID not found or invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6">
      
      {/* Top Brand Header / Navigation */}
      <div className="w-full max-w-xl flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </button>
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
          Official Verifier
        </span>
      </div>

      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200/80 shadow-xl overflow-hidden">
        
        {/* Verification Card Header */}
        <div className="p-6 bg-slate-900 text-white text-center space-y-2">
          <div className="p-3 bg-white/10 text-indigo-400 rounded-2xl w-fit mx-auto backdrop-blur-xs border border-white/10">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Credential Verification Engine</h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Verify the authenticity of completion certificates issued by AI Education Academy
          </p>
        </div>

        {/* Input Form */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleVerify} className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Enter Unique Certificate ID / Verification Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  placeholder="e.g., CERT-2026-X1Y2Z3"
                  className="w-full pl-10 pr-3 h-10 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-slate-900 font-mono transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-5 h-10 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                {loading ? 'Verifying...' : 'Verify Credential'}
              </button>
            </div>
          </form>

          {/* SUCCESS RESULT CARD */}
          {verificationResult && (
            <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Official Verified Credential</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  Status: {verificationResult.status || 'Valid'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-100 flex items-start gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Name</span>
                    <strong className="text-slate-900">{verificationResult.student_name}</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-100 flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Course Name</span>
                    <strong className="text-slate-900">{verificationResult.course_name}</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-100 flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Issue Date</span>
                    <strong className="text-slate-900 font-mono">{verificationResult.issue_date}</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-100 flex items-start gap-2">
                  <Award className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Grade Achieved</span>
                    <strong className="text-slate-900 font-mono">{verificationResult.grade_achieved || 'Pass'}</strong>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono text-center pt-1">
                Certificate ID: {verificationResult.certificate_id}
              </div>
            </div>
          )}

          {/* ERROR RESULT CARD */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800 font-bold animate-in fade-in duration-300">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400 font-mono">
          AI Education Academy Verification Portal &bull; Secured with Cryptographic Signatures
        </div>

      </div>
    </div>
  );
}