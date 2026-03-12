import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Shield, Lock, Mail, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in as super admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email === 'gajula@gmail.com' && user.role === 'admin') {
      navigate('/admin/super-admin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      // Verify this is the super admin account
      if (result.user.email === 'gajula@gmail.com' && result.user.role === 'admin') {
        navigate('/admin/super-admin');
      } else {
        setError('Access denied. This portal is for Super Admin only.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    // Quick login functionality removed - users must enter credentials manually
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-amber-900 to-yellow-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-yellow-500">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-amber-600 px-6 py-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="flex justify-center items-center space-x-3 mb-4">
                <Crown className="text-yellow-200" size={48} />
                <Shield className="text-yellow-200" size={40} />
                <Lock className="text-yellow-200" size={32} />
              </div>
              <h1 className="text-3xl font-bold mb-2">Super Admin Portal</h1>
              <p className="text-yellow-100">Complete System Control</p>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-red-600" size={20} />
              <div>
                <h3 className="text-red-900 font-semibold text-sm">Restricted Access</h3>
                <p className="text-red-700 text-xs">This portal provides complete control over all user profiles and system data.</p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form id="login-form" onSubmit={handleLogin} className="p-6 space-y-6" autoComplete="off">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                Super Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                placeholder="Enter super admin email"
                required
                autoComplete="off"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Lock size={16} className="inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                  placeholder="Enter super admin password"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-yellow-700 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Crown size={20} />
                  <span>Access Super Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <div className="text-center">
              <p className="text-xs text-slate-600 mb-2">Super Admin Capabilities:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">User Management</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Profile Control</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">System Oversight</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Data Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-yellow-200 text-xs">
            <Shield size={12} className="inline mr-1" />
            This is a secure administrative portal. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
