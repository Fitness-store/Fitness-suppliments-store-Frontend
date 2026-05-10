import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/useAdminAuth';
import { Eye, EyeOff, Dumbbell } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  if (isAdminAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin({ email, password });
      navigate('/admin');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#06080f' }}>
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse-slow" style={{ background: 'rgba(228,185,74,0.06)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] animate-pulse-slow" style={{ background: 'rgba(249,115,22,0.05)', animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]" style={{ background: 'rgba(228,185,74,0.03)' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(228,185,74,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(228,185,74,0.2) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-4"
            style={{ background: 'linear-gradient(135deg, #e4b94a, #f97316)', boxShadow: '0 8px 32px rgba(228,185,74,0.25)' }}
          >
            <Dumbbell size={28} style={{ color: '#09090b' }} />
          </div>
          <h1 className="text-2xl font-bold text-white">IronCore Admin</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(228,185,74,0.5)' }}>Management Portal</p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl p-8 shadow-2xl backdrop-blur-xl" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.1)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(228,185,74,0.7)' }}>Email Address</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white text-sm transition-all focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(228,185,74,0.1)', }}
                onFocus={e => e.target.style.borderColor = 'rgba(228,185,74,0.3)'}
                onBlur={e => e.target.style.borderColor = 'rgba(228,185,74,0.1)'}
                placeholder="admin@ironcore.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(228,185,74,0.7)' }}>Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm transition-all focus:outline-none pr-12"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(228,185,74,0.1)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(228,185,74,0.3)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(228,185,74,0.1)'}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #e4b94a, #f97316)',
                color: '#09090b',
                boxShadow: '0 4px 20px rgba(228,185,74,0.25)'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(228,185,74,0.3)' }}>
          Authorized personnel only. All actions are logged.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
