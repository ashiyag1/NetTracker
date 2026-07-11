import React from 'react';

function Stats({ activeCount, brokenCount, expiringCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* Card 1: Active Devices */}
      <div className="bg-[#16161a] p-6 rounded-2xl border border-[#1b1b1f] hover:border-[#8b5cf6]/10 flex items-center space-x-4 transition-all duration-300">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">Active Devices</p>
          <p className="text-3xl font-black text-white mt-1">{activeCount}</p>
        </div>
      </div>

      {/* Card 2: Broken Devices */}
      <div className="bg-[#16161a] p-6 rounded-2xl border border-[#1b1b1f] hover:border-[#8b5cf6]/10 flex items-center space-x-4 transition-all duration-300">
        <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">Broken / Inactive</p>
          <p className="text-3xl font-black text-white mt-1">{brokenCount}</p>
        </div>
      </div>

      {/* Card 3: Expiring Soon (Violet Theme) */}
      <div className="bg-[#16161a] p-6 rounded-2xl border border-[#1b1b1f] hover:border-[#8b5cf6]/10 flex items-center space-x-4 transition-all duration-300">
        <div className="p-3 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-xl border border-[#8b5cf6]/20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">Warranty Expiring (30 Days)</p>
          <p className="text-3xl font-black text-[#8b5cf6] mt-1">{expiringCount}</p>
        </div>
      </div>

    </div>
  );
}

export default Stats;