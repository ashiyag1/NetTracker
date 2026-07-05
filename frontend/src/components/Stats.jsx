import React from 'react';

// We pass data into this component using "Props" (destructured inside the { })
function Stats({ activeCount, brokenCount, expiringCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* Card 1: Active Devices */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-emerald-50 text-emerald-500 rounded-lg">
          {/* A simple inline Green SVG Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Active Devices</p>
          <p className="text-2xl font-bold text-gray-800">{activeCount}</p>
        </div>
      </div>

      {/* Card 2: Broken Devices */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-rose-50 text-rose-500 rounded-lg">
          {/* A simple inline Red SVG Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Broken / Inactive</p>
          <p className="text-2xl font-bold text-gray-800">{brokenCount}</p>
        </div>
      </div>

      {/* Card 3: Expiring Soon */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-amber-50 text-amber-500 rounded-lg">
          {/* A simple inline Orange SVG Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Warranty Expiring (30 Days)</p>
          <p className="text-2xl font-bold text-gray-800">{expiringCount}</p>
        </div>
      </div>

    </div>
  );
}

export default Stats;