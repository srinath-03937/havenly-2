import { useState, useEffect } from 'react';
import { Users, AlertCircle, DollarSign, Zap, Loader } from 'lucide-react';
import { adminAPI, aiAPI } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  // Helper function to format dates safely
  const formatDate = (dateValue) => {
    if (!dateValue) return 'No Date';
    
    try {
      let date;
      if (dateValue.toDate) {
        // Firebase Timestamp
        date = dateValue.toDate();
      } else if (dateValue instanceof Date) {
        // JavaScript Date object
        date = dateValue;
      } else if (typeof dateValue === 'string') {
        // String date
        date = new Date(dateValue);
      } else if (typeof dateValue === 'number') {
        // Timestamp number
        date = new Date(dateValue);
      } else if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
        // Firebase Timestamp object (alternative format)
        date = new Date(dateValue.seconds * 1000);
      } else {
        return 'Invalid Date';
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error, 'for value:', dateValue);
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoadingStats(true);
      const [statsRes, complaintsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getComplaints()
      ]);

      setStats(statsRes.data);
      setComplaints(complaintsRes.data.slice(0, 5)); // Recent 5

      // Fetch AI insights
      generateInsights(statsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const generateInsights = async (statsData) => {
    try {
      setLoadingInsights(true);
      const response = await aiAPI.getFacilityInsights({
        occupancy: statsData.occupancy,
        pendingTickets: statsData.pendingComplaints,
        revenue: statsData.revenueCollected,
        capacity: statsData.totalRooms
      });
      setInsights(response.data.insights);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Unable to generate insights at this moment.');
    } finally {
      setLoadingInsights(false);
    }
  };

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back, Admin. Here's an overview of your hostel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-indigo-600" size={32} />
            <span className="text-3xl font-bold text-indigo-600">{stats?.occupancy}%</span>
          </div>
          <p className="text-slate-600 text-sm">Occupancy Rate</p>
          <p className="text-xs text-slate-500 mt-2">
            {stats?.occupiedRooms}/{stats?.totalRooms} rooms occupied
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="text-yellow-600" size={32} />
            <span className="text-3xl font-bold text-yellow-600">{stats?.pendingComplaints}</span>
          </div>
          <p className="text-slate-600 text-sm">Pending Tickets</p>
          <p className="text-xs text-slate-500 mt-2">Awaiting assignment</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="text-green-600" size={32} />
            <span className="text-3xl font-bold text-green-600">₹{Number(stats?.revenueCollected || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <p className="text-slate-600 text-sm">Revenue Collected</p>
          <p className="text-xs text-slate-500 mt-2">This month</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <Zap className="text-red-600" size={32} />
            <span className="text-3xl font-bold text-red-600">₹{Number(stats?.pendingDues || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <p className="text-slate-600 text-sm">Pending Dues</p>
          <p className="text-xs text-slate-500 mt-2">Awaiting payment</p>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="card border-2 border-indigo-200 bg-indigo-50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-indigo-600 rounded-lg">
            <Zap className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-indigo-900">AI Facility Insights</h2>
        </div>

        {loadingInsights ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin text-indigo-600 mr-3" size={24} />
            <p className="text-indigo-700">Generating insights...</p>
          </div>
        ) : (
          <div className="space-y-3 whitespace-pre-wrap text-indigo-900 leading-relaxed">
            {insights}
          </div>
        )}

        <button
          onClick={() => generateInsights(stats)}
          disabled={loadingInsights}
          className="mt-4 btn-primary text-sm"
        >
          Refresh Insights
        </button>
      </div>

      {/* Recent Complaints */}
      <div className="card">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Maintenance Tickets</h2>

        <div className="space-y-4">
          {complaints.length === 0 ? (
            <p className="text-slate-600 text-center py-8">No complaints yet</p>
          ) : (
            complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {complaint.user_id?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">{complaint.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-slate-500">
                        Category: <span className="font-medium">{complaint.category}</span>
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDate(complaint.date)}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${
                    complaint.status === 'Pending' ? 'badge-pending' :
                    complaint.status === 'Assigned' ? 'badge-assigned' :
                    'badge-resolved'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
