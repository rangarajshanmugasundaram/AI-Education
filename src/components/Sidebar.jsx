import React, { memo } from 'react';

const Sidebar = ({ toggleMobileMenu, isOpen }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-[260px] bg-slate-800 text-white z-[1050] transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-[70px] items-center justify-between px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400 text-sm font-extrabold text-slate-900">AI</div>
          <span className="text-base font-bold text-slate-50">AI Education</span>
        </div>
        <button onClick={toggleMobileMenu} className="md:hidden p-2 text-slate-400">✕</button>
      </div>

      <div className="flex items-center gap-3.5 bg-slate-900/20 px-6 py-5 border-b border-white/5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-xs font-semibold">MD</div>
        <div className="flex flex-col">
          <div className="text-sm font-semibold">Markarn Doe</div>
          <div className="text-[11px] text-slate-400">Administrator</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mt-5 mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">PERSONAL</div>
        <div className="flex items-center gap-3 rounded-lg bg-cyan-400/10 px-3.5 py-3 text-sm font-semibold text-cyan-400 cursor-pointer">
          <span>📊</span> Dashboard
        </div>
        <div className="flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium text-slate-400 hover:bg-slate-700/50 cursor-pointer">
          <span>📄</span> Page Layouts
        </div>
      </nav>
    </aside>
  );
};

export default memo(Sidebar);