import React, { useState } from 'react';

function DeviceTable({ devices, onDelete, onEdit, onReportIssue, role }) {
  // 1. States for Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Dynamically get all unique client company names for our filter dropdown
  const clientCompanies = ['All', ...new Set(devices.map(d => d.client).filter(Boolean))];

  // 2. Filter logic (runs automatically on every render)
  const filteredDevices = devices.filter(device => {
    // Search term filter
    const matchSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        device.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchStatus = statusFilter === 'All' ? true : device.status === statusFilter;
    
    // Type filter
    const matchType = typeFilter === 'All' ? true : device.type === typeFilter;

    // Client filter
    const matchClient = clientFilter === 'All' ? true : device.client === clientFilter;
    
    return matchSearch && matchStatus && matchType && matchClient;
  });

  // Reset to page 1 whenever any filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, clientFilter]);

  // Pagination Math
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const paginatedDevices = filteredDevices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  // Pure JavaScript CSV Export Utility
  const downloadCSV = () => {
    const headers = ['Device Name', 'Type', 'Client Company', 'Status', 'Location', 'Serial Number', 'Warranty Expiry'];
    
    const rows = filteredDevices.map(d => [
      `"${d.name.replace(/"/g, '""')}"`, // escape quotes
      `"${d.type}"`,
      `"${d.client}"`,
      `"${d.status}"`,
      `"${d.location || ''}"`,
      `"${d.serialNumber || ''}"`,
      d.warrantyExpiry ? `"${new Date(d.warrantyExpiry).toLocaleDateString()}"` : ''
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Trigger a browser file download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nettrack_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#16161a]/60 border border-[#1b1b1f] rounded-3xl p-6 shadow-xl backdrop-blur-sm">
      
      {/* Table Title and Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Device Inventory</h2>
          <p className="text-sm text-slate-400">Total matched: {filteredDevices.length}</p>
        </div>

        {/* Search, Filters, and CSV Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search name or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1c1c22] text-white text-sm px-4 py-2 rounded-xl border border-[#2c2c35] focus:outline-none focus:border-[#8b5cf6] transition-colors w-full sm:w-48"
          />

          {/* Client Filter (Only show to Admins and Technicians) */}
          {role !== 'client' && (
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="bg-[#1c1c22] text-slate-300 rounded-xl px-4 py-2 border border-[#2c2c35] text-sm focus:outline-none focus:border-[#8b5cf6] cursor-pointer"
            >
              {clientCompanies.map(company => (
                <option key={company} value={company}>{company === 'All' ? 'All Clients' : company}</option>
              ))}
            </select>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1c1c22] text-slate-300 rounded-xl px-4 py-2 border border-[#2c2c35] text-sm focus:outline-none focus:border-[#8b5cf6] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Broken">Broken</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#1c1c22] text-slate-300 rounded-xl px-4 py-2 border border-[#2c2c35] text-sm focus:outline-none focus:border-[#8b5cf6] cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Router">Router</option>
            <option value="Switch">Switch</option>
            <option value="IP Phone">IP Phone</option>
            <option value="AVEquipment">AV Equipment</option>
            <option value="Other">Other</option>
          </select>

          {/* CSV Download Button */}
          <button
            onClick={downloadCSV}
            className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1b1b1f] text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-4">Device Name</th>
              <th className="py-4 px-4">Type</th>
              <th className="py-4 px-4">Client</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Location</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1b1b1f]/50 text-sm text-slate-300">
            {paginatedDevices.length > 0 ? (
              paginatedDevices.map((device) => (
                <tr key={device._id} className="hover:bg-[#1c1c22]/30 transition-colors group">
                  <td className="py-4 px-4 font-semibold text-white group-hover:text-[#8b5cf6] transition-colors">
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
                    {role === 'admin' && (
                      <>
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
                      </>
                    )}
                    
                    {role === 'technician' && (
                      <button 
                        onClick={() => onEdit(device)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                    
                    {role === 'client' && (
                      device.status === 'Active' ? (
                        <button 
                          onClick={() => onReportIssue(device._id)}
                          className="text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
                        >
                          Report Issue
                        </button>
                      ) : (
                        <span className="text-slate-500 text-xs italic">
                          {device.status === 'Broken' ? 'Issue Reported' : 'Under Repair'}
                        </span>
                      )
                    )}
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

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#1b1b1f] pt-4 mt-4">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-white">{Math.min(currentPage * itemsPerPage, filteredDevices.length)}</span> of <span className="font-semibold text-white">{filteredDevices.length}</span> devices
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                currentPage === 1 
                  ? 'bg-[#1c1c22] text-slate-600 cursor-not-allowed' 
                  : 'bg-[#2c2c35] text-white hover:bg-[#8b5cf6] hover:text-black cursor-pointer'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                currentPage === totalPages 
                  ? 'bg-[#1c1c22] text-slate-600 cursor-not-allowed' 
                  : 'bg-[#2c2c35] text-white hover:bg-[#8b5cf6] hover:text-black cursor-pointer'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default DeviceTable;