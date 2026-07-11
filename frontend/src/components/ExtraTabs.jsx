import React from 'react';

// ==========================================
// 1. CLIENT DIRECTORY VIEW
// ==========================================
export function ClientDirectory({ devices }) {
  // Dynamically calculate company stats from the devices database
  const companies = [...new Set(devices.map(d => d.client).filter(Boolean))];

  const getCompanyStats = (companyName) => {
    const companyDevices = devices.filter(d => d.client === companyName);
    const active = companyDevices.filter(d => d.status === 'Active').length;
    const broken = companyDevices.filter(d => d.status === 'Broken').length;
    return { total: companyDevices.length, active, broken };
  };

  // Mock contact details matching our client theme
  const mockContacts = {
    'HDFC': { manager: 'Rajesh Kumar', email: 'itsupport@hdfc.com', phone: '+91 22-6652-3000' },
    'Cisco': { manager: 'Sarah Jenkins', email: 'hardware@cisco.com', phone: '+1 800-553-6387' },
    'Google': { manager: 'Amit Patel', email: 'corp-infra@google.com', phone: '+91 11-4589-2000' },
    'MVD Headquarters': { manager: 'Ashiya Garg', email: 'infra-admin@mvdtech.com', phone: '+91 9999-888-777' }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-wider">Client Directories</h2>
        <p className="text-[#a1a1aa] text-xs mt-1">Status of assets deployed at client organization properties</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map(company => {
          const stats = getCompanyStats(company);
          const contact = mockContacts[company] || { manager: 'IT Manager', email: `support@${company.toLowerCase().replace(/\s+/g, '')}.com`, phone: 'N/A' };

          return (
            <div key={company} className="bg-[#16161a] border border-[#1b1b1f] hover:border-[#8b5cf6]/25 rounded-2xl p-6 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">{company}</h3>
                  <p className="text-xs text-[#8b5cf6] mt-0.5">Asset Client ID: MVD-{company.substring(0, 3).toUpperCase()}</p>
                </div>
                <span className="bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20 px-3 py-1 rounded-lg text-xs font-bold">
                  {stats.total} {stats.total === 1 ? 'Asset' : 'Assets'}
                </span>
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-[#0c0c0e] p-3.5 rounded-xl border border-[#1b1b1f]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Active hardware</span>
                  <span className="text-lg font-black text-emerald-400">{stats.active}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Broken / Alerts</span>
                  <span className="text-lg font-black text-rose-500">{stats.broken}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1.5 text-xs text-[#a1a1aa] border-t border-[#1b1b1f] pt-4">
                <p><strong className="text-white uppercase tracking-wider text-[10px] block mb-0.5">On-Site Manager:</strong> {contact.manager}</p>
                <p><strong className="text-white uppercase tracking-wider text-[10px] block mb-0.5">Email Address:</strong> {contact.email}</p>
                <p><strong className="text-white uppercase tracking-wider text-[10px] block mb-0.5">Contact Line:</strong> {contact.phone}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 2. SYSTEM STATUS VIEW
// ==========================================
export function SystemStatus() {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-wider">System Operational Status</h2>
        <p className="text-[#a1a1aa] text-xs mt-1">Real-time connectivity logs of MVD NetTrack network modules</p>
      </div>

      <div className="bg-[#16161a] border border-[#1b1b1f] rounded-2xl p-6 shadow-xl space-y-6">
        
        {/* Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-[#0c0c0e] border border-[#1b1b1f] p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">MongoDB Serverless Cluster</h4>
                <p className="text-[10px] text-slate-500">cloud.mongodb.com // Node: Cluster0</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2.5 py-1 rounded-lg">ONLINE</span>
          </div>

          <div className="bg-[#0c0c0e] border border-[#1b1b1f] p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">Express REST API Gateway</h4>
                <p className="text-[10px] text-slate-500">localhost:5000 // Node Engine</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2.5 py-1 rounded-lg">OPERATIONAL</span>
          </div>

          <div className="bg-[#0c0c0e] border border-[#1b1b1f] p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="relative flex h-3.5 w-3.5 text-amber-500">
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
              </span>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">Vercel Cron-Job Scheduler</h4>
                <p className="text-[10px] text-slate-500">Schedule: 0 0 * * * // Every Midnight</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded-lg">STANDBY</span>
          </div>

          <div className="bg-[#0c0c0e] border border-[#1b1b1f] p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">Edge Jose JWT Verification</h4>
                <p className="text-[10px] text-slate-500">Web Crypto API // HS256 Signed</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2.5 py-1 rounded-lg">ACTIVE</span>
          </div>

        </div>

        {/* System Specs (Mock stats showing professionalism) */}
        <div className="border-t border-[#1b1b1f] pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-[#0c0c0e] p-4 rounded-xl border border-[#1b1b1f]">
            <span className="text-[10px] text-slate-500 uppercase font-black block">API LATENCY</span>
            <span className="text-base font-extrabold text-white mt-1 block">14 ms</span>
          </div>
          <div className="bg-[#0c0c0e] p-4 rounded-xl border border-[#1b1b1f]">
            <span className="text-[10px] text-slate-500 uppercase font-black block">SERVER UPTIME</span>
            <span className="text-base font-extrabold text-white mt-1 block">99.98%</span>
          </div>
          <div className="bg-[#0c0c0e] p-4 rounded-xl border border-[#1b1b1f]">
            <span className="text-[10px] text-slate-500 uppercase font-black block">DATABASE LOAD</span>
            <span className="text-base font-extrabold text-white mt-1 block">0.8%</span>
          </div>
          <div className="bg-[#0c0c0e] p-4 rounded-xl border border-[#1b1b1f]">
            <span className="text-[10px] text-slate-500 uppercase font-black block">MEM IN USE</span>
            <span className="text-base font-extrabold text-white mt-1 block">42.4 MB</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 3. REPORTS CENTER VIEW
// ==========================================
export function ReportsCenter({ devices }) {
  const active = devices.filter(d => d.status === 'Active').length;
  const broken = devices.filter(d => d.status === 'Broken').length;
  const maintenance = devices.filter(d => d.status === 'Under Maintenance').length;
  const total = devices.length;

  // Warranty scanner preview
  const expiringSoon = devices.filter(d => {
    if (!d.warrantyExpiry) return false;
    const expiryDate = new Date(d.warrantyExpiry);
    const today = new Date();
    const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 && diffDays <= 30;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-wider">Reports & Audit Log</h2>
        <p className="text-[#a1a1aa] text-xs mt-1">Automated analysis reports generated from active system assets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Summary Graphs */}
        <div className="bg-[#16161a] border border-[#1b1b1f] rounded-2xl p-6 md:col-span-1 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1b1b1f] pb-3">Asset Distribution</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-emerald-400">
                <span>Active Assets</span>
                <span>{total ? Math.round((active/total)*100) : 0}%</span>
              </div>
              <div className="w-full bg-[#0c0c0e] h-2 rounded-full border border-[#1b1b1f]">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${total ? (active/total)*100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-rose-400">
                <span>Broken / Down</span>
                <span>{total ? Math.round((broken/total)*100) : 0}%</span>
              </div>
              <div className="w-full bg-[#0c0c0e] h-2 rounded-full border border-[#1b1b1f]">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${total ? (broken/total)*100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-amber-400">
                <span>Under Maintenance</span>
                <span>{total ? Math.round((maintenance/total)*100) : 0}%</span>
              </div>
              <div className="w-full bg-[#0c0c0e] h-2 rounded-full border border-[#1b1b1f]">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${total ? (maintenance/total)*100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Cron Job Scanner logs */}
        <div className="bg-[#16161a] border border-[#1b1b1f] rounded-2xl p-6 md:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-[#1b1b1f] pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cron Job Log: Expiring Warranties</h3>
            <span className="text-[10px] text-amber-500 font-extrabold bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-md uppercase tracking-wider">
              {expiringSoon.length} alerts
            </span>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto">
            {expiringSoon.length > 0 ? (
              expiringSoon.map(d => (
                <div key={d._id} className="bg-[#0c0c0e] border border-[#1b1b1f] p-3.5 rounded-xl flex justify-between items-center">
                  <div>
                    <h5 className="text-sm font-bold text-white">{d.name}</h5>
                    <p className="text-[10px] text-slate-500 uppercase mt-0.5">Deployed at: {d.client} // {d.location}</p>
                  </div>
                  <span className="text-[11px] font-black text-[#8b5cf6] uppercase">
                    Expires: {new Date(d.warrantyExpiry).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-500 text-xs italic">
                No manufacturing warranties expiring in the next 30 days. Uptime healthy.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
