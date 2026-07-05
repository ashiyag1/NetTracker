import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import Stats from './components/Stats';
import DeviceTable from './components/DeviceTable';
import AddDeviceModal from './components/AddDeviceModal';

function App() {
  // Initialize devices as an empty array [] (no more mock data!)
  const [devices, setDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);

  // 2. Fetch all devices from our backend API when the page loads
  useEffect(() => {
    fetchDevices();
  }, []); // The empty array [] means "only run this once when the component first loads"

  const fetchDevices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/devices');
      const data = await response.json();
      setDevices(data); // Save the database records into our state!
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  // 3. Save a new device to the database via API
  const addDevice = async (newDevice) => {
    try {
      const response = await fetch('http://localhost:5000/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDevice)
      });
      const savedDevice = await response.json();

      // Add the saved device (which has its real DB ID now) to our React state
      setDevices([...devices, savedDevice]);
    } catch (error) {
      console.error("Error saving device:", error);
    }
  };

  // Update a device via API
  const updateDevice = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/devices/${deviceToEdit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await response.json();

      // Replace the old device with the updated one in React state
      setDevices(devices.map(d => d._id === data._id ? data : d));
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };

  // Decide whether to add new or update existing
  const handleSaveDevice = (deviceData) => {
    if (deviceToEdit) {
      updateDevice(deviceData);
    } else {
      addDevice(deviceData);
    }
  };

  // Opens modal for editing
  const handleEditClick = (device) => {
    setDeviceToEdit(device);
    setIsModalOpen(true);
  };

  // Resets state when modal closes
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDeviceToEdit(null);
  };

  // 4. Delete a device from the database via API
  const deleteDevice = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/devices/${id}`, {
        method: 'DELETE'
      });

      // Update our React state to remove the deleted device from the screen
      setDevices(devices.filter(device => device._id !== id));
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  // Calculate counts dynamically from our state
  const activeCount = devices.filter(d => d.status === 'Active').length;
  const brokenCount = devices.filter(d => d.status === 'Broken').length;
  
  // Calculate warranties expiring within 30 days
  const expiringCount = devices.filter(d => {
    if (!d.warrantyExpiry) return false;
    const expiryDate = new Date(d.warrantyExpiry);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return diffDays > 0 && diffDays <= 30;
  }).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">NetTrack</h1>
            <p className="text-slate-400 text-sm mt-1">MVD Digital Device Register</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer"
          >
            + Add Device
          </button>
        </header>

        {/* Stats Section */}
        <Stats 
          activeCount={activeCount} 
          brokenCount={brokenCount} 
          expiringCount={expiringCount} 
        />

        {/* Device Table Section */}
        <DeviceTable devices={devices} onDelete={deleteDevice} onEdit={handleEditClick} />

        {/* Add Device Modal Popup */}
        <AddDeviceModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddDevice={handleSaveDevice}
          deviceToEdit={deviceToEdit}
        />

      </div>
    </div>
  );
}

export default App;