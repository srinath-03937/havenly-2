import { useState, useEffect } from 'react';
import { Plus, Loader, AlertCircle, History, Clock } from 'lucide-react';
import { studentAPI } from '../../utils/api';

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [historyComplaints, setHistoryComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Maintenance',
    description: ''
  });

  // Initialize with empty data and no loading to prevent infinite loading
  useEffect(() => {
    // Set initial state immediately
    setLoading(false);
    setHistoryLoading(false);
    
    // Then fetch data
    fetchComplaints();
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getComplaints();
      setComplaints(response.data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setComplaints([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await studentAPI.getComplaintsHistory();
      setHistoryComplaints(response.data || []);
    } catch (error) {
      console.error('Error fetching complaint history:', error);
      setHistoryComplaints([]); // Set empty array on error
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      await studentAPI.createComplaint(formData);
      setFormData({ category: 'Maintenance', description: '' });
      setShowForm(false);
      await fetchComplaints();
    } catch (error) {
      alert('Error creating complaint: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressStatus = (status) => {
    if (status === 'Pending') return 1;
    if (status === 'Assigned') return 2;
    if (status === 'Resolved') return 3;
    return 1;
  };

  // Only show loader if explicitly loading and not showing history
  if (loading && !showHistory) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-responsive">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 text-responsive">
            Complaints
          </h1>
          <p className="text-slate-600 text-responsive-sm">
            Manage your maintenance complaints
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* History Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`btn-primary flex items-center justify-center space-x-2 ${
              showHistory ? 'bg-slate-600 hover:bg-slate-700' : ''
            }`}
          >
            {showHistory ? (
              <>
                <AlertCircle size={16} />
                <span>Active Issues</span>
              </>
            ) : (
              <>
                <History size={16} />
                <span>View History</span>
              </>
            )}
          </button>
          
          {/* New Complaint Button - Only show when not in history view */}
          {!showHistory && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Plus size={16} />
              <span>New Complaint</span>
            </button>
          )}
        </div>
      </div>

      {/* History Info Banner */}
      {showHistory && (
        <div className="card border-2 border-blue-200 bg-blue-50">
          <div className="flex items-start space-x-3">
            <Clock className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Complaint History</h3>
              <p className="text-sm text-blue-700">
                Showing all your complaints, including those resolved more than 24 hours ago. 
                Active complaints are shown in the main view.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lodge Complaint Form - only show when not in history view */}
      {!showHistory && showForm && (
        <div className="card border-2 border-indigo-200 bg-indigo-50">
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-6 text-responsive">
            Lodge New Complaint
          </h2>

          {/* Complaint Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="input-field text-base"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Electricity">Electricity</option>
                <option value="Plumbing">Plumbing</option>
                <option value="WiFi">WiFi/Internet</option>
                <option value="Water">Water Supply</option>
                <option value="Air Conditioning">Air Conditioning</option>
                <option value="Furniture">Furniture</option>
                <option value="Security">Security</option>
                <option value="Noise">Noise Issue</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Laundry">Laundry</option>
                <option value="Mess/Food">Mess/Food</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your complaint in detail..."
                className="input-field h-24 text-base"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50 flex items-center justify-center space-x-2 min-h-[44px]"
              >
                {submitting ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    <span>Submit Complaint</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ category: 'Maintenance', description: '' });
                  setShortDescription('');
                  setEnhancedDescription('');
                }}
                className="btn-secondary min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {(loading || historyLoading) && (
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin text-indigo-600" size={40} />
        </div>
      )}

      {/* Complaints List */}
      {!loading && !historyLoading && (
        <div className="space-y-4">
          {(showHistory ? historyComplaints : complaints).length === 0 ? (
            <div className="card text-center py-8">
              <AlertCircle className="mx-auto text-slate-400 mb-4" size={40} />
              <p className="text-slate-600 text-lg text-responsive-sm">
                {showHistory ? 'No complaints in history' : 'No active complaints'}
              </p>
              {!showHistory && !showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary mt-4"
                >
                  Lodge Your First Complaint
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {(showHistory ? historyComplaints : complaints).map((complaint) => (
                <div
                  key={complaint.id}
                  className={`card ${
                    complaint.status === 'Resolved' && 
                    complaint.resolvedAt && 
                    new Date(complaint.resolvedAt.toDate ? complaint.resolvedAt.toDate() : complaint.resolvedAt) < new Date(Date.now() - 24 * 60 * 60 * 1000)
                      ? 'opacity-75 border-slate-300'
                      : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{complaint.category}</h3>
                        <span className={`badge ${
                          complaint.status === 'Pending' ? 'badge-pending' :
                          complaint.status === 'Assigned' ? 'badge-assigned' :
                          'badge-resolved'
                        }`}>
                          {complaint.status}
                        </span>
                        {showHistory && complaint.status === 'Resolved' && (
                          <span className="text-xs text-slate-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            Archived
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{complaint.description}</p>
                      <div className="text-xs text-slate-500">
                        <p>Submitted: {new Date(complaint.date.toDate ? complaint.date.toDate() : complaint.date).toLocaleDateString()}</p>
                        {complaint.resolvedAt && (
                          <p>Resolved: {new Date(complaint.resolvedAt.toDate ? complaint.resolvedAt.toDate() : complaint.resolvedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3 sm:mt-0 sm:ml-4">
                      <div className="w-full sm:w-32 bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            complaint.status === 'Pending' ? 'bg-yellow-500 w-1/3' :
                            complaint.status === 'Assigned' ? 'bg-blue-500 w-2/3' :
                            'bg-green-500 w-full'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentComplaints;
