import React from 'react';

function Navbar({ username, onLogout, onHomeClick, activeTab, setActiveTab }) {
  // Class helper to apply glowing violet bottom borders to the active tab
  const getTabClass = (tabName) => {
    const baseClass = "text-xs font-extrabold px-3 py-1.5 uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-none";
    if (activeTab === tabName) {
      return `${baseClass} text-[#8b5cf6] border-b-2 border-[#8b5cf6]`;
    }
    return `${baseClass} text-[#a1a1aa] hover:text-[#8b5cf6] border-b-2 border-transparent hover:border-[#8b5cf6]/30`;
  };

  return (
    <nav className="bg-[#0c0c0e] border-b border-[#1b1b1f] px-6 py-4 mb-8 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        
        {/* Brand Logo (Clickable to go home/reset filters) */}
        <button 
          onClick={onHomeClick}
          className="flex items-center space-x-2.5 cursor-pointer focus:outline-none hover:opacity-85 transition-opacity"
        >
          <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center font-black text-black shadow-lg shadow-[#8b5cf6]/25">
            N
          </div>
          <span className="text-lg font-black text-white tracking-widest uppercase">NetTrack</span>
        </button>

        {/* 2. Interactive Navigation Tabs */}
        <div className="flex items-center space-x-1 md:space-x-3">
          <button
            onClick={onHomeClick}
            className={getTabClass('dashboard')}
          >
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('clients')}
            className={getTabClass('clients')}
          >
            Clients
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={getTabClass('reports')}
          >
            Reports
          </button>
        </div>

        {/* 3. User Session Profile & Logout */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] flex items-center justify-center font-black text-sm border border-[#8b5cf6]/20">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-[#a1a1aa] hidden md:inline">{username}</span>
          </div>

          <button
            onClick={onLogout}
            className="text-xs font-bold text-[#a1a1aa] hover:text-white border border-[#2c2c35] hover:border-[#8b5cf6]/40 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer uppercase tracking-wider bg-[#16161a]"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;