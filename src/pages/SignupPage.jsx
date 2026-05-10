import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/useAuth';
import { Eye, EyeOff, Dumbbell, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' };

  const fields = [
    { name: 'fullName', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Doe', required: true },
    { name: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'you@example.com', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+91 98765 43210', required: false },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Navbar />

      <div className="pt-28 sm:pt-36 pb-12 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-1/3 w-80 h-80 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(228,185,74,0.08), transparent 70%)' }} />
          <div className="absolute bottom-20 left-1/4 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06), transparent 70%)' }} />
        </div>

        <div className="max-w-md mx-auto px-4 relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: 'var(--accent-grad)', boxShadow: '0 8px 32px rgba(228,185,74,0.2)' }}>
              <Dumbbell className="w-7 h-7" style={{ color: '#09090b' }} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Account</h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Join IronCore for premium supplements</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl p-6 sm:p-8 backdrop-blur-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                  {error}
                </div>
              )}

              {/* Dynamic Fields */}
              {fields.map(({ name, label, type, icon: Icon, placeholder, required }) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {label}
                    {!required && <span className="ml-1 text-xs" style={{ color: 'var(--text-muted)' }}>(optional)</span>}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all focus:outline-none"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(228,185,74,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      required={required}
                    />
                  </div>
                </div>
              ))}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full pl-11 pr-12 py-3 rounded-xl text-sm transition-all focus:outline-none"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(228,185,74,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base"
                style={{ background: 'var(--accent-grad)', color: '#09090b', boxShadow: '0 4px 20px rgba(228,185,74,0.2)' }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>ALREADY A MEMBER?</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            {/* Login link */}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              style={{ background: 'transparent', border: '1px solid var(--border-hover)', color: 'var(--text-primary)' }}
            >
              Sign In Instead
            </Link>
          </div>

          {/* Trust badge */}
          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;
