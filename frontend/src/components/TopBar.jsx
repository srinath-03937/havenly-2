import { Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const TopBar = () => {
  const { user } = useAuth();

  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-white/15 text-white' : 'bg-white/15 text-white';
  };

  return (
    <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-700 border-b border-white/10 shadow-sm sticky top-0 z-40" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-1 md:pl-64 min-h-12 flex items-center">
        <div className="w-full flex items-center justify-between">
          {/* Welcome Message - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block">
            <h2 className="text-white font-semibold text-responsive">Welcome back!</h2>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Notifications */}
            <button 
              className="relative text-white/90 hover:text-white transition p-2 rounded-lg hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell size={20} className="sm:size-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User Info - Hidden on very small screens */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-white truncate max-w-[120px] sm:max-w-none">
                  {user?.name || 'User'}
                </p>
                <p className={`text-xs px-2 py-1 rounded-full inline-block ${getRoleColor(user?.role)}`}>
                  {user?.role === 'admin' ? 'Administrator' : 'Student'}
                </p>
              </div>
              
              {/* Avatar */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
