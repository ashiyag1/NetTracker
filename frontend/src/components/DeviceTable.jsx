import React, { useState } from 'react';

function DeviceTable({ devices, onDelete, onEdit }) {
  // 1. States for Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // 2. Filter logic (runs automatically on every render)
  const filteredDevices = devices.filter(device => {
    const matchesSearch = 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || device.status === statusFilter;
    const matchesType = typeFilter === 'All' || device.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Helper function to return nice CSS colors for different statuses
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Broken':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'Under Maintenance':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
      
      {/* Table Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Device Inventory</h2>
          <p className="text-sm text-slate-400">Total matched: {filteredDevices.length}</p>
        </div>

        {/* Search and Filters Container */}
        <div className="flex flex-wrap gap-3">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search name or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 text-white text-sm px-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors w-full sm:w-48"
          />

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 text-white text-sm px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Broken">Broken</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>

          {/* Type Filter Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-800 text-white text-sm px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Types</option>
            <option value="Router">Router</option>
            <option value="Switch">Switch</option>
            <option value="IP Phone">IP Phone</option>
            <option value="AV Equipment">AV Equipment</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-4">Device Name</th>
              <th className="py-4 px-4">Type</th>
              <th className="py-4 px-4">Client</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Location</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
            {filteredDevices.length > 0 ? (
              filteredDevices.map((device) => (
                <tr key={device._id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="py-4 px-4 font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {device.name}
                  </td>
                  <td className="py-4 px-4 text-slate-400">{device.type}</td>
                  <td className="py-4 px-4">{device.client}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(device.status)}`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400">{device.location}</td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => onEdit(device)}
                      className="text-indigo-400 hover:text-indigo-300 font-medium mr-3 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                      <button 
                      onClick={() => onDelete(device._id)}
                      className="text-rose-400 hover:text-rose-300 font-medium transition-colors cursor-pointer"
                    >
                    Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-500">
                  No devices match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeviceTable;