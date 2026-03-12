import { useState, useEffect } from 'react';
import { Loader, AlertCircle, DollarSign, Home, Building } from 'lucide-react';
import { studentAPI } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [room, setRoom] = useState(null);
  const [pendingDues, setPendingDues] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [roomRes, duesRes] = await Promise.all([
        studentAPI.getRoom(),
        studentAPI.getPendingDues()
      ]);

      setRoom(roomRes.data);
      setPendingDues(duesRes.data.totalDues);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-responsive">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 text-responsive">
          Welcome back!
        </h1>
        <p className="text-slate-600 text-responsive-sm">
          Here's your hostel information and status
        </p>
      </div>

      {/* Room Details Card */}
      {room ? (
        <div className="card border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-2xl flex-shrink-0">
                🏨
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Room {room.room_number}</h2>
                <p className="text-slate-600 text-responsive-sm">Wing {room.wing}</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm sm:text-base inline-block self-start">
              {room.type}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <p className="text-sm text-slate-600 mb-1">Monthly Rent</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">₹{room.price}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Room Capacity</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{room.capacity} persons</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Current Occupancy</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{room.occupancy}/{room.capacity}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-2 border-yellow-200 bg-yellow-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
            <div className="flex-1">
              <p className="font-bold text-yellow-900">No Room Assigned</p>
              <p className="text-sm text-yellow-700 mb-3">Browse available rooms and book your space with upfront payment.</p>
              <button
                onClick={() => navigate('/student/rooms')}
                className="btn-primary text-sm bg-yellow-600 hover:bg-yellow-700 w-full sm:w-auto"
              >
                Browse & Book Rooms
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Pending Dues Card */}
        <div className="card border-2 border-red-200 bg-red-50">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
            <div>
              <p className="text-sm text-slate-600 mb-2">Pending Dues</p>
              <p className="text-3xl sm:text-4xl font-bold text-red-600">₹{pendingDues}</p>
            </div>
            <DollarSign className="text-red-600 flex-shrink-0" size={32} />
          </div>

          <p className="text-xs text-slate-600 mb-4">You have outstanding payments</p>

          <button
            onClick={() => navigate('/student/payments')}
            className="btn-primary w-full bg-red-600 hover:bg-red-700"
          >
            View & Pay Dues
          </button>
        </div>

        {/* Quick Actions Card */}
        <div className="card border-2 border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
            <div>
              <p className="text-sm text-slate-600 mb-2">Quick Actions</p>
              <p className="text-lg font-bold text-slate-900">Need Help?</p>
            </div>
            <Home className="text-indigo-600 flex-shrink-0" size={32} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/student/complaints')}
              className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 rounded-lg font-medium transition text-sm"
            >
              Lodge a Complaint
            </button>
            <button
              onClick={() => navigate('/student/notices')}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-medium transition text-sm"
            >
              View Notices
            </button>
            {!room && (
              <button
                onClick={() => navigate('/student/rooms')}
                className="col-span-1 sm:col-span-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-900 rounded-lg font-medium transition text-sm flex items-center justify-center space-x-2"
              >
                <Building size={16} />
                <span>Book a Room</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Your Activity</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Total Complaints</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">--</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Resolved Issues</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">--</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Payments Made</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">--</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
