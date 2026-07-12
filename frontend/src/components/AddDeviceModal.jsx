import React, { useState, useEffect } from 'react';

function AddDeviceModal({ isOpen, onClose, onAddDevice, deviceToEdit }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Router');
  const [client, setClient] = useState('');
  const [status, setStatus] = useState('Active');
  const [location, setLocation] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [warrantyExpiry, setWarrantyExpiry] = useState('');

  // State for dynamic client dropdown
  const [availableClients, setAvailableClients] = useState([]);
  const [isNewClient, setIsNewClient] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : '/api');

  // Fetch available clients from backend on load
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`${API_URL}/devices/clients`);
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setAvailableClients(data);
        }
      } catch (err) {
        console.error("Failed to load clients:", err);
      }
    };
    if (isOpen) fetchClients();
  }, [isOpen]);

  useEffect(() => {
    if (deviceToEdit) {
      setName(deviceToEdit.name || '');
      setType(deviceToEdit.type || 'Router');
      setClient(deviceToEdit.client || '');
      setStatus(deviceToEdit.status || 'Active');
      setLocation(deviceToEdit.location || '');
      setSerialNumber(deviceToEdit.serialNumber || '');
      setWarrantyExpiry(deviceToEdit.warrantyExpiry ? deviceToEdit.warrantyExpiry.split('T')[0] : '');
      // If editing a device whose client isn't in the list (rare but possible), default to text input
      setIsNewClient(false); 
    } else {
      setName('');
      setType('Router');
      setClient('');
      setStatus('Active');
      setLocation('');
      setSerialNumber('');
      setWarrantyExpiry('');
      setIsNewClient(false);
    }
  }, [deviceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !client) {
      alert("Please fill in the Device Name and Client Name.");
      return;
    }

    const newDevice = {
      name,
      type,
      client,
      status,
      location: location || 'Client Office',
      serialNumber,
      warrantyExpiry
    };

    onAddDevice(newDevice);

    setName('');
    setClient('');
    setLocation('');
    setSerialNumber('');
    setWarrantyExpiry('');

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      
      {/* Modal Box */}
      <div className="bg-[#16161a] border border-[#1b1b1f] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        
        {/* Title */}
        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wider">
          {deviceToEdit ? 'Edit Device Details' : 'Add New Hardware'}
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Device Name */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Device Name *</label>
            <input
              type="text"
              placeholder="e.g. Core Switch 24-Port"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1c1c22] border border-[#2c2c35] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
              required
            />
          </div>

          {/* Client */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Client Name *</label>
            
            {/* If the user clicked 'Add New Client', or there are no existing clients, show text input */}
            {(isNewClient || availableClients.length === 0) ? (
              <div className="relative animate-fade-in">
                <input
                  type="text"
                  placeholder="e.g. HDFC Bank"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full bg-[#1c1c22] border border-[#2c2c35] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
                  required
                />
                {availableClients.length > 0 && (
                  <button 
                    type="button" 
                    onClick={() => setIsNewClient(false)}
                    className="absolute right-3 top-2.5 text-xs text-[#8b5cf6] hover:text-[#a78bfa] font-bold uppercase tracking-wider"
                  >
                    Use Existing
                  </button>
                )}
              </div>
            ) : (
              <select
                value={client}
                onChange={(e) => {
                  if (e.target.value === 'ADD_NEW') {
                    setIsNewClient(true);
                    setClient('');
                  } else {
                    setClient(e.target.value);
                  }
                }}
                className="w-full bg-[#1c1c22] border border-[#2c2c35] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b5cf6] cursor-pointer"
                required
              >
                <option value="" disabled>Select an existing client...</option>
                {availableClients.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="ADD_NEW" className="font-bold text-[#a78bfa]">+ Add New Client...</option>
              </select>
            )}
          </div>

          {/* Type and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Device Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#1c1c22] border border-[#2c2c35] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b5cf6] cursor-pointer"
              >
                <option value="Router">Router</option>
                <option value="Switch">Switch</option>
                <option value="IP Phone">IP Phone</option>
                <option value="AVEquipment">AV Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#1c1c22] border border-[#2c2c35] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b5cf6] cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Broken">Broken</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          {/* Location & Serial Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Location</label>
              <input
                type="text"
                placeholder="Server Room / Desk 4"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#1c1c22] border border-[#2c2c35] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Serial Number</label>
              <input
                type="text"
                placeholder="SN-XXXXX"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full bg-[#1c1c22] border border-[#2c2c35] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
              />
            </div>
          </div>

          {/* Warranty Expiry */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Warranty Expiration Date</label>
            <input
              type="date"
              value={warrantyExpiry}
              onChange={(e) => setWarrantyExpiry(e.target.value)}
              className="w-full bg-[#1c1c22] border border-[#2c2c35] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-[#1b1b1f] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#2c2c35] bg-[#1c1c22] text-[#a1a1aa] hover:bg-[#2c2c35] hover:text-white text-sm font-bold transition-all cursor-pointer uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#8b5cf6] hover:bg-[#a78bfa] text-black text-sm font-extrabold transition-all cursor-pointer uppercase tracking-wider"
            >
              {deviceToEdit ? 'Update Asset' : 'Save Asset'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default AddDeviceModal;