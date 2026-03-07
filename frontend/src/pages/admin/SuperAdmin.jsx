import { useState, useEffect } from 'react';
import { Loader, Users, Trash2, Search, Shield, Mail, Phone, Calendar, AlertTriangle, CheckCircle, Crown, Lock, Eye, Edit, UserPlus, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const SuperAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    // Get current user info
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setDeletingId(userId);
      await adminAPI.deleteUser(userId);
      await fetchUsers();
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const openProfileModal = (user) => {
    setProfileUser(user);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setProfileUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'student':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (user) => {
    if (user.room_id) {
      return <CheckCircle className="text-green-600" size={16} />;
    }
    return <AlertTriangle className="text-yellow-600" size={16} />;
  };

  const isSuperAdmin = (user) => {
    return user.email === 'gajula@gmail.com';
  };

  const canDeleteUser = (user) => {
    // Cannot delete self or the super admin
    return !isSuperAdmin(user) && user.id !== currentUser?.id;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center space-x-3">
            <Crown className="text-yellow-500" size={40} />
            <span>Super Admin Panel</span>
            <Lock className="text-red-500" size={24} />
          </h1>
          <p className="text-slate-600 mt-2">Complete system control - Manage all user profiles</p>
          {currentUser?.email === 'gajula@gmail.com' && (
            <div className="mt-2 flex items-center space-x-2">
              <Shield className="text-green-600" size={16} />
              <span className="text-sm text-green-600 font-medium">Super Admin Access Confirmed</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="text-3xl font-bold text-indigo-600">{users.length}</p>
          <button
            onClick={fetchUsers}
            className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <RefreshCw size={12} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="text-red-600" size={24} />
          <div>
            <h3 className="text-red-900 font-semibold">Super Admin Privileges</h3>
            <p className="text-red-700 text-sm">You have complete control over all user profiles and system data. Actions cannot be undone.</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-blue-600" size={32} />
            <span className="text-3xl font-bold text-blue-600">
              {users.filter(u => u.role === 'student').length}
            </span>
          </div>
          <p className="text-slate-600 text-sm">Students</p>
          <p className="text-xs text-slate-500 mt-2">Active student accounts</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <Shield className="text-purple-600" size={32} />
            <span className="text-3xl font-bold text-purple-600">
              {users.filter(u => u.role === 'admin').length}
            </span>
          </div>
          <p className="text-slate-600 text-sm">Administrators</p>
          <p className="text-xs text-slate-500 mt-2">System administrators</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="text-yellow-600" size={32} />
            <span className="text-3xl font-bold text-yellow-600">
              {users.filter(u => !u.room_id).length}
            </span>
          </div>
          <p className="text-slate-600 text-sm">Unassigned</p>
          <p className="text-xs text-slate-500 mt-2">Users without rooms</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="text-green-600" size={32} />
            <span className="text-3xl font-bold text-green-600">
              {users.filter(u => u.room_id).length}
            </span>
          </div>
          <p className="text-slate-600 text-sm">Assigned</p>
          <p className="text-xs text-slate-500 mt-2">Users with rooms</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Search className="text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-slate-700">Role:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-x-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">All User Profiles</h2>

        {filteredUsers.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No users found</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">User</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Room</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Joined</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`border-b border-slate-100 hover:bg-slate-50 ${isSuperAdmin(user) ? 'bg-yellow-50' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSuperAdmin(user) ? 'bg-yellow-100' : 'bg-indigo-100'}`}>
                        <span className={`${isSuperAdmin(user) ? 'text-yellow-600' : 'text-indigo-600'} font-semibold`}>
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 flex items-center space-x-2">
                          {user.name || 'Unknown'}
                          {isSuperAdmin(user) && <Crown className="text-yellow-500" size={16} />}
                        </p>
                        <p className="text-sm text-slate-500">ID: {user.id?.slice(-8) || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail size={14} className="text-slate-400" />
                        <span className="text-slate-600">{user.email || 'N/A'}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone size={14} className="text-slate-400" />
                          <span className="text-slate-600">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getRoleBadge(user.role)}`}>
                      {user.role || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {user.room_id ? (
                      <span className="text-sm text-slate-600">
                        {user.room_id?.room_number || 'Assigned'}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">No Room</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(user)}
                      <span className="text-sm text-slate-600">
                        {user.room_id ? 'Assigned' : 'Unassigned'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      <span>
                        {user.createdAt ? 
                          new Date(user.createdAt.toDate ? user.createdAt.toDate() : user.createdAt).toLocaleDateString() 
                          : 'Unknown'
                        }
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openProfileModal(user)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Profile"
                      >
                        <Eye size={18} />
                      </button>
                      {canDeleteUser(user) ? (
                        <button
                          onClick={() => openDeleteModal(user)}
                          disabled={deletingId === user.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete User"
                        >
                          {deletingId === user.id ? (
                            <Loader className="animate-spin" size={18} />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center space-x-1 text-slate-400">
                          <Lock size={16} />
                          <span className="text-xs">Protected</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && profileUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                <Eye size={24} className="text-blue-600" />
                <span>User Profile</span>
                {isSuperAdmin(profileUser) && <Crown className="text-yellow-500" size={20} />}
              </h3>
              <button
                onClick={closeProfileModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <AlertTriangle size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Basic Information</h4>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm"><span className="font-medium">Name:</span> {profileUser.name || 'N/A'}</p>
                    <p className="text-sm"><span className="font-medium">Email:</span> {profileUser.email || 'N/A'}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {profileUser.phone || 'N/A'}</p>
                    <p className="text-sm"><span className="font-medium">Role:</span> 
                      <span className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${getRoleBadge(profileUser.role)}`}>
                        {profileUser.role || 'Unknown'}
                      </span>
                    </p>
                    <p className="text-sm"><span className="font-medium">User ID:</span> {profileUser.id || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Status & Assignments */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Status & Assignments</h4>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm flex items-center">
                      <span className="font-medium mr-2">Room Status:</span>
                      {getStatusIcon(profileUser)}
                      <span className="ml-2">{profileUser.room_id ? 'Assigned' : 'Unassigned'}</span>
                    </p>
                    {profileUser.room_id && (
                      <p className="text-sm"><span className="font-medium">Room:</span> {profileUser.room_id?.room_number || 'Assigned'}</p>
                    )}
                    <p className="text-sm"><span className="font-medium">Joined:</span> 
                      {profileUser.createdAt ? 
                        new Date(profileUser.createdAt.toDate ? profileUser.createdAt.toDate() : profileUser.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Unknown'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeProfileModal}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Delete User Account</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-600 mb-4">
                Are you sure you want to delete this user account? This action cannot be undone and will remove all associated data.
              </p>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-medium text-slate-900">{selectedUser.name}</p>
                <p className="text-sm text-slate-600">{selectedUser.email}</p>
                <p className="text-sm text-slate-500 mt-1">Role: {selectedUser.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleDeleteUser(selectedUser.id)}
                disabled={deletingId === selectedUser.id}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === selectedUser.id ? 'Deleting...' : 'Delete User'}
              </button>
              <button
                onClick={closeDeleteModal}
                disabled={deletingId === selectedUser.id}
                className="flex-1 bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
