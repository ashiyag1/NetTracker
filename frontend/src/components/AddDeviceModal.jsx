import React, { useState, useEffect } from 'react';

function AddDeviceModal({ isOpen, onClose, onAddDevice, deviceToEdit }) {
  // 1. Define states for each form input field
  const [name, setName] = useState('');
  const [type, setType] = useState('Router'); // Default to Router
  const [client, setClient] = useState('');
  const [status, setStatus] = useState('Active'); // Default to Active
  const [location, setLocation] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [warrantyExpiry, setWarrantyExpiry] = useState('');

  // Populate the form if we are editing a device
  useEffect(() => {
    if (deviceToEdit) {
      setName(deviceToEdit.name || '');
      setType(deviceToEdit.type || 'Router');
      setClient(deviceToEdit.client || '');
      setStatus(deviceToEdit.status || 'Active');
      setLocation(deviceToEdit.location || '');
      setSerialNumber(deviceToEdit.serialNumber || '');
      setWarrantyExpiry(deviceToEdit.warrantyExpiry ? deviceToEdit.warrantyExpiry.split('T')[0] : '');
    } else {
      // Clear form if we are adding a new device
      setName('');
      setType('Router');
      setClient('');
      setStatus('Active');
      setLocation('');
      setSerialNumber('');
      setWarrantyExpiry('');
    }
  }, [deviceToEdit, isOpen]);

  // If the parent says this modal shouldn't be open, render nothing
  if (!isOpen) return null;

  // 2. Submit handler
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page

    // Basic validation: Make sure required fields are not empty
    if (!name || !client) {
      alert("Please fill in the Device Name and Client Name.");
      return;
    }

    // Create the new device object
    const newDevice = {
      name,
      type,
      client,
      status,
      location: location || 'Client Office', // Default if empty
      serialNumber,
      warrantyExpiry
    };

    // Call the parent's function to save this device
    onAddDevice(newDevice);

    // Reset the form fields to blank for next time
    setName('');
    setClient('');
    setLocation('');
    setSerialNumber('');
    setWarrantyExpiry('');

    // Close the modal
    onClose();
  };

  return (
    // Backdrop blur overlay covering the entire screen
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      
      {/* Modal Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-6">
          {deviceToEdit ? 'Edit Device' : 'Add New Device'}
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Device Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Device Name *</label>
            <input
              type="text"
              placeholder="e.g. Core Switch 24-Port"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Row 2: Client */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Client Name *</label>
            <input
              type="text"
              placeholder="e.g. HDFC Bank"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Row 3: Type and Status (Grid layout) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Device Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Router">Router</option>
                <option value="Switch">Switch</option>
                <option value="IP Phone">IP Phone</option>
                <option value="AV Equipment">AV Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Active">Active</option>
                <option value="Broken">Broken</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          {/* Row 4: Location & Serial Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Location</label>
              <input
                type="text"
                placeholder="Server Room / Desk 4"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Serial Number</label>
              <input
                type="text"
                placeholder="SN-XXXXX"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Row 5: Warranty Expiry */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Warranty Expiration Date</label>
            <input
              type="date"
              value={warrantyExpiry}
              onChange={(e) => setWarrantyExpiry(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {deviceToEdit ? 'Update Device' : 'Save Device'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default AddDeviceModal;