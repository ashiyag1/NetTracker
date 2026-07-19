const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : '/api');

// Helper to get auth headers
const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

// Device API Calls
export const deviceService = {
    getAll: async (token) => {
        const response = await fetch(`${API_URL}/devices`, {
            headers: getAuthHeaders(token)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch devices");
        return data;
    },

    create: async (token, newDevice) => {
        const response = await fetch(`${API_URL}/devices`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(newDevice)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to add device");
        return data;
    },

    update: async (token, id, updatedData) => {
        const response = await fetch(`${API_URL}/devices/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(token),
            body: JSON.stringify(updatedData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to update device");
        return data;
    },

    delete: async (token, id) => {
        const response = await fetch(`${API_URL}/devices/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(token)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to delete device");
        return data;
    },

    reportIssue: async (token, id) => {
        const response = await fetch(`${API_URL}/devices/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(token),
            body: JSON.stringify({ status: 'Broken' })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to report issue");
        return data;
    },

    getUniqueClients: async () => {
        const response = await fetch(`${API_URL}/devices/clients`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch clients");
        return data;
    },

    getUniqueDeviceNames: async () => {
        const response = await fetch(`${API_URL}/devices/names`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch device names");
        return data;
    }
};
