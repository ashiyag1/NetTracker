import React, { useState, useEffect } from 'react';

// We pass `onLoginSuccess` as a prop so we can tell the parent (App.jsx) that the user logged in
function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false); // Toggles between Login and Register
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('client'); // default role for testing
  const [clientCompany, setClientCompany] = useState('');

  // Initialize Google Sign-in on Mount / Toggle
  useEffect(() => {
    /* global google */
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (googleClientId && window.google) {
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleResponse
      });

      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { 
          theme: 'dark', 
          size: 'large', 
          width: '380',
          logo_alignment: 'left'
        }
      );
    }
  }, [isRegister]); // Re-render Google button container when toggling views

  // Handle Google Token Response
  const handleGoogleResponse = async (response) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Google Authentication failed');
      }

      // Success: pass user data back to App.jsx
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler for standard form login/signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? 'register' : 'login';

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role, clientCompany })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center p-4">
      
      {/* Sleek, glowing glassmorphic card */}
      <div className="bg-[#16161a]/60 border border-[#1b1b1f] backdrop-blur-md p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Soft background glow spots (Violet) */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#8b5cf6]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#a855f7]/5 rounded-full blur-3xl"></div>

        {/* Title */}
        <div className="text-center mb-8 relative">
          <h2 className="text-3xl font-black text-white tracking-widest uppercase">NetTrack</h2>
          <p className="text-[#a1a1aa] text-xs font-semibold uppercase tracking-wider mt-2">
            {isRegister ? 'Register IT Account' : 'Technician Authorization'}
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2.5 rounded-xl text-sm mb-6 animate-fade-in">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Username</label>
            <input
              type="text"
              placeholder="e.g. technician1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1c1c22] border border-[#2c2c35] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1c1c22] border border-[#2c2c35] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
              required
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Account Role</label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  if (e.target.value !== 'client') setClientCompany(''); // Reset if not client
                }}
                className="w-full bg-[#1c1c22] border border-[#2c2c35] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8b5cf6] cursor-pointer"
              >
                <option value="client">Client (Read-Only)</option>
                <option value="technician">Technician (Add & Edit)</option>
                <option value="admin">Admin (All Permissions)</option>
              </select>
            </div>
          )}

          {/* Show this field only if the role is 'client' during registration */}
          {isRegister && role === 'client' && (
            <div className="animate-fade-in">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Client Company Name</label>
              <input
                type="text"
                placeholder="e.g. HDFC or Cisco (Case Sensitive)"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                className="w-full bg-[#1c1c22] border border-[#2c2c35] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8b5cf6]"
                required
              />
              <p className="text-slate-500 text-xs mt-1">Must match the exact client name of their devices.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8b5cf6] hover:bg-[#a78bfa] disabled:bg-[#8b5cf6]/60 text-black font-extrabold py-3.5 rounded-xl shadow-lg shadow-[#8b5cf6]/10 hover:shadow-[#8b5cf6]/20 transition-all cursor-pointer text-sm uppercase tracking-wider"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-4 items-center justify-center text-xs text-zinc-600 uppercase">
          <span className="border-t border-[#1b1b1f] flex-grow"></span>
          <span className="mx-4 font-bold tracking-wider">Or</span>
          <span className="border-t border-[#1b1b1f] flex-grow"></span>
        </div>

        {/* Google Sign In Button Container */}
        <div className="flex justify-center w-full min-h-[44px]">
          {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <div id="google-signin-btn" className="w-full flex justify-center"></div>
          ) : (
            <p className="text-zinc-600 text-[10px] text-center uppercase tracking-widest font-bold">
              Google Auth: Client ID missing in .env
            </p>
          )}
        </div>

        {/* Switch Mode Link */}
        <div className="text-center mt-6 text-sm relative">
          <p className="text-slate-400">
            {isRegister ? 'Already have an account?' : 'New to NetTrack?'}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-[#8b5cf6] hover:text-[#a78bfa] font-bold ml-2 transition-colors cursor-pointer"
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;