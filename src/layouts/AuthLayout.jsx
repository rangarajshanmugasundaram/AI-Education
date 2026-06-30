import React, { memo } from 'react';
import illustration from '@/assets/login/illustration.png';

const AuthLayout = ({ children }) => (
  <main className="min-h-screen flex flex-col lg:flex-row relative bg-slate-900">
    
    <div className="absolute inset-0 z-0 lg:hidden">
      <img src={illustration} alt="Background" className="w-full h-full object-cover opacity-30" />
    </div>

    <section className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-16 flex-col justify-center relative z-10">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-blue-600 text-sm font-semibold rounded-full mb-4">
            AI Education
          </span>
          <h1 className="text-5xl font-bold leading-tight">
            Empowering Minds with AI Education
          </h1>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex-1">
            <p className="text-slate-300 mb-6 text-lg">
              The premier digital ecosystem designed to bridge the gap between traditional academics and the rapidly evolving world of artificial intelligence.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span><strong>Smart Learning:</strong> Adaptive pathways tailored to your unique goals.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span><strong>Track Progress:</strong> Real-time skill analytics to measure your growth.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span><strong>AI Assistance:</strong> 24/7 intelligent mentorship for instant support.</span>
              </li>
            </ul>
          </div>
          <div className="w-64">
            <img src={illustration} alt="AI Learning Illustration" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>

    <section className="w-full lg:w-1/2 flex items-center justify-center p-6 z-10 relative">
      <div className="w-full max-w-md">
        {children}
      </div>
    </section>
  </main>
);

export default memo(AuthLayout);