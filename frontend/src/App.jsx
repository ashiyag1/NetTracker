import React, { useState, useEffect } from 'react';
import Stats from './components/Stats';
import DeviceTable from './components/DeviceTable';
import AddDeviceModal from './components/AddDeviceModal';
import Login from './components/Login'; 
import Navbar from './components/Navbar'; 
import Landing from './components/Landing'; 
import { ClientDirectory, ReportsCenter } from './components/ExtraTabs'; 

const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : '/api');

function App() {
  // 1. Authentication State
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Tab Navigation State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'clients', 'reports'
  
  // Device & Modal States
  const [devices, setDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);

  // 2. SESSION RESTORE (Runs once when the app first loads)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Restores session from browser storage
    }
  }, []);

  // 3. FETCH DEVICES (Runs automatically whenever the user logs in)
  useEffect(() => {
    if (user) {
      fetchDevices();
    } else {
      setDevices([]); // Clear list if user logs out
      setActiveTab('dashboard'); // Reset tab
    }
  }, [user]);

  const fetchDevices = async () => {
    try {
      const response = await fetch(`${API_URL}/devices`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setDevices(data);
      } else {
        console.error("API error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  // 4. Save a new device
  const addDevice = async (newDevice) => {
    try {
      const response = await fetch(`${API_URL}/devices`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newDevice)
      });
      const savedDevice = await response.json();

      if (response.ok) {
        setDevices([...devices, savedDevice]);
      } else {
        alert(savedDevice.message || "Failed to add device");
      }
    } catch (error) {
      console.error("Error saving device:", error);
    }
  };

  // 5. Update an existing device
  const updateDevice = async (updatedData) => {
    try {
      const response = await fetch(`${API_URL}/devices/${deviceToEdit._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await response.json();

      if (response.ok) {
        setDevices(devices.map(d => d._id === data._id ? data : d));
      } else {
        alert(data.message || "Failed to update device");
      }
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };

  // 6. Delete a device
  const deleteDevice = async (id) => {
    try {
      const response = await fetch(`${API_URL}/devices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setDevices(devices.filter(device => device._id !== id));
      } else {
        alert(data.message || "Failed to delete device");
      }
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  // 7. Report an issue (For clients - PUT request that sets status to 'Broken')
  const reportIssue = async (id) => {
    try {
      const response = await fetch(`${API_URL}/devices/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: 'Broken' })
      });
      const data = await response.json();

      if (response.ok) {
        setDevices(devices.map(d => d._id === data._id ? data : d));
      } else {
        alert(data.message || "Failed to report issue");
      }
    } catch (error) {
      console.error("Error reporting issue:", error);
    }
  };

  // Handle Save button (Decides whether to add new or update existing)
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

  // LOGIN SUCCESS HANDLER
  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData)); 
    setUser(userData); 
  };

  // LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem('user'); 
    setUser(null); 
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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 && diffDays <= 30;
  }).length;

  // CONDITIONAL RENDERING GATE:
  // If user is not logged in:
  if (!user) {
    if (showAuthModal) {
      return (
        <div className="relative min-h-screen bg-[#0c0c0e] flex flex-col">
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-6 left-6 text-xs font-semibold text-[#a1a1aa] hover:text-white border border-[#1b1b1f] px-3.5 py-2 rounded-xl bg-[#16161a]/50 hover:bg-[#16161a] transition-all cursor-pointer z-50 uppercase tracking-wider"
          >
            &larr; Back to Home
          </button>
          <Login onLoginSuccess={handleLoginSuccess} />
        </div>
      );
    }
    return <Landing onGetStarted={() => setShowAuthModal(true)} />;
  }

  const handleHomeClick = () => {
    setShowAuthModal(false);
    setActiveTab('dashboard'); // Go back to dashboard view
    if (user) fetchDevices(); 
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f4f4f5] pb-12 animate-fade-in">
      
      {/* 1. Header Navigation Bar */}
      <Navbar 
        username={user.username} 
        onLogout={handleLogout} 
        onHomeClick={handleHomeClick} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="max-w-6xl mx-auto px-6">
        
        {/* 2. Conditionally Render Views based on Active Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Header Action Section */}
            <header className="mb-10 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight uppercase">System Dashboard</h1>
                <p className="text-[#a1a1aa] text-xs mt-1">Real-time status of client hardware inventory</p>
              </div>
              {user.role !== 'client' && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#8b5cf6] hover:bg-[#a78bfa] text-black font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-[#8b5cf6]/10 hover:shadow-[#8b5cf6]/20 transition-all cursor-pointer text-sm uppercase tracking-wider"
                >
                  + Add Device
                </button>
              )}
            </header>

            {/* Metrics Stats Row */}
            <Stats 
              activeCount={activeCount} 
              brokenCount={brokenCount} 
              expiringCount={expiringCount} 
            />

            {/* Device List Table */}
            <DeviceTable 
              devices={devices} 
              onDelete={deleteDevice} 
              onEdit={handleEditClick} 
              onReportIssue={reportIssue}
              role={user.role}
            />
          </>
        )}

        {/* Clients Directory Tab */}
        {activeTab === 'clients' && (
          <ClientDirectory devices={devices} />
        )}

        {/* Maintenance Reports Tab */}
        {activeTab === 'reports' && (
          <ReportsCenter devices={devices} />
        )}

      </div>

      {/* Add / Edit Device Modal Popup */}
      <AddDeviceModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddDevice={handleSaveDevice}
        deviceToEdit={deviceToEdit}
      />

      {/* 5. Sleek Footer */}
      <footer className="max-w-6xl mx-auto px-6 mt-16 text-center text-xs text-[#52525b] border-t border-[#1b1b1f] pt-8">
        <p>NetTrack &copy; 2026. Secure IT Asset Management System.</p>
        <p className="mt-1.5 text-[#8b5cf6]/50 uppercase tracking-widest text-[9px] font-bold">All secure connections operational.</p>
      </footer>

    </div>
  );
}

export default App;