import { useState, useEffect } from 'react';
import { Loader, RefreshCw, History, Clock } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [historyComplaints, setHistoryComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [showHistory, setShowHistory] = useState(false);

  // Helper function to format dates safely
  const formatDate = (dateValue) => {
    if (!dateValue) return 'No Date';
    
    try {
      let date;
      
      // Handle Firebase Timestamp object with toDate method
      if (dateValue && typeof dateValue === 'object' && typeof dateValue.toDate === 'function') {
        date = dateValue.toDate();
      }
      // Handle Firebase Timestamp with seconds property
      else if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
        date = new Date(dateValue.seconds * 1000);
      }
      // Handle JavaScript Date
      else if (dateValue instanceof Date) {
        date = dateValue;
      }
      // Handle string
      else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      }
      // Handle number
      else if (typeof dateValue === 'number') {
        date = new Date(dateValue);
      }
      else {
        // If it's an object but not a timestamp, try to convert
        if (dateValue && typeof dateValue === 'object') {
          // Try to get seconds from nested structure
          if (dateValue._seconds || dateValue._nanoseconds) {
            date = new Date((dateValue._seconds || 0) * 1000 + (dateValue._nanoseconds || 0) / 1000000);
          } else {
            return 'Invalid Date';
          }
        } else {
          return 'Invalid Date';
        }
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
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    fetchComplaints();
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getComplaints();
      console.log('Raw complaints data:', response.data);
      console.log('First complaint structure:', response.data[0]);
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await adminAPI.getComplaintsHistory();
      setHistoryComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaint history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await adminAPI.updateComplaint(id, { status: newStatus });
      await fetchComplaints();
    } catch (error) {
      alert('Error updating complaint: ' + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredComplaints = filterStatus === 'All'
    ? complaints
    : complaints.filter(c => c.status === filterStatus);

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
          <h1 className="text-4xl font-bold text-slate-900">Maintenance Tickets</h1>
          <p className="text-slate-600 mt-2">Manage student complaints and maintenance requests</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`btn-secondary flex items-center space-x-2 ${
              showHistory ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''
            }`}
          >
            <History size={20} />
            <span>{showHistory ? 'Active Tickets' : 'View History'}</span>
          </button>
          <button
            onClick={showHistory ? fetchHistory : fetchComplaints}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter - only show for active complaints */}
      {!showHistory && (
        <div className="flex items-center space-x-2">
          {['All', 'Pending', 'Assigned', 'Resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      {/* History Info Banner */}
      {showHistory && (
        <div className="card bg-indigo-50 border-2 border-indigo-200">
          <div className="flex items-center space-x-3">
            <Clock className="text-indigo-600" size={24} />
            <div>
              <h3 className="font-bold text-indigo-900">Complaint History</h3>
              <p className="text-indigo-700 text-sm">
                View all complaints including those resolved more than 24 hours ago. 
                Active complaints are automatically hidden from the main list after 24 hours of being resolved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Complaints List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          {showHistory ? 'All Complaints (History)' : 'Active Complaints'}
        </h2>

        {(showHistory ? historyLoading : loading) ? (
          <div className="flex items-center justify-center min-h-screen">
            <Loader className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : (
          (() => {
            const currentComplaints = showHistory ? historyComplaints : filteredComplaints;
            
            return currentComplaints.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-slate-600 text-lg">
                  {showHistory ? 'No complaints in history' : 'No complaints found'}
                </p>
              </div>
            ) : (
              currentComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className={`card border-l-4 hover:shadow-md transition ${
                    showHistory && complaint.status === 'Resolved' && complaint.resolvedAt
                      ? 'border-l-4 border-slate-400 opacity-75'
                      : 'border-l-4 border-indigo-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {complaint.user_id?.name || 'Unknown Student'}
                        </h3>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          complaint.category === 'Plumbing' ? 'bg-blue-100 text-blue-800' :
                          complaint.category === 'Electrical' ? 'bg-yellow-100 text-yellow-800' :
                          complaint.category === 'Maintenance' ? 'bg-purple-100 text-purple-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {complaint.category}
                        </span>
                        {showHistory && complaint.status === 'Resolved' && complaint.resolvedAt && (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                            Archived
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 mb-3">{complaint.description}</p>
                      <p className="text-xs text-slate-500">
                        📧 {complaint.user_id?.email} | 📅 {formatDate(complaint.date)}
                        {complaint.resolvedAt && (
                          <> | ✅ Resolved: {formatDate(complaint.resolvedAt)}</>
                        )}
                      </p>
                    </div>

                    <div className="ml-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                      <select
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                        disabled={updatingId === complaint.id || (showHistory && complaint.status === 'Resolved' && complaint.resolvedAt)}
                        className={`px-3 py-2 border rounded-lg font-medium transition ${
                          complaint.status === 'Pending' ? 'bg-yellow-50 border-yellow-300 text-yellow-800' :
                          complaint.status === 'Assigned' ? 'bg-blue-50 border-blue-300 text-blue-800' :
                          'bg-green-50 border-green-300 text-green-800'
                        } ${(updatingId === complaint.id || (showHistory && complaint.status === 'Resolved' && complaint.resolvedAt)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      {updatingId === complaint.id && (
                        <p className="text-xs text-indigo-600 mt-1">Updating...</p>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-slate-600">Progress</label>
                      <span className="text-xs text-slate-600">
                        {complaint.status === 'Pending' ? '33%' :
                         complaint.status === 'Assigned' ? '66%' : '100%'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          complaint.status === 'Pending' ? 'w-1/3 bg-yellow-400' :
                          complaint.status === 'Assigned' ? 'w-2/3 bg-blue-400' :
                          'w-full bg-green-400'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )
          })()
        )}
      </div>
    </div>
  );
};

export default AdminComplaints;
