import { useState, useEffect } from 'react';
import { Plus, Loader, Wand2, AlertCircle, History, Clock } from 'lucide-react';
import { studentAPI, aiAPI } from '../../utils/api';

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [historyComplaints, setHistoryComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [shortDescription, setShortDescription] = useState('');
  const [enhancedDescription, setEnhancedDescription] = useState('');
  const [enhancingLoading, setEnhancingLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Maintenance',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaints();
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getComplaints();
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
      const response = await studentAPI.getComplaintsHistory();
      setHistoryComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaint history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const enhanceDescription = async () => {
    if (!shortDescription.trim()) {
      alert('Please enter a brief description');
      return;
    }

    try {
      setEnhancingLoading(true);
      const response = await aiAPI.enhanceComplaint({ shortDescription });
      setEnhancedDescription(response.data.enhancedDescription);
    } catch (error) {
      alert('Error enhancing description: ' + error.message);
    } finally {
      setEnhancingLoading(false);
    }
  };

  const useEnhancedDescription = () => {
    setFormData({
      ...formData,
      description: enhancedDescription
    });
    setEnhancedDescription('');
    setShortDescription('');
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

  if (loading) {
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

          {/* AI Enhance Section */}
          <div className="mb-6 p-4 bg-white rounded-lg border border-indigo-300">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Wand2 size={20} className="text-indigo-600 flex-shrink-0" />
              <span className="text-responsive-sm">AI-Powered Description Enhancement</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Describe Your Issue Briefly (e.g., "fan is too loud", "tap is leaking")
                </label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Keep it brief - AI will enhance it..."
                  className="input-field h-16 text-base"
                />
              </div>

              <button
                type="button"
                onClick={enhanceDescription}
                disabled={enhancingLoading || !shortDescription.trim()}
                className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 w-full sm:w-auto min-h-[44px]"
              >
                {enhancingLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Enhancing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={20} />
                    <span>Enhance with AI</span>
                  </>
                )}
              </button>

              {enhancedDescription && (
                <div className="mt-4 p-3 bg-slate-100 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 mb-2">Enhanced Description:</p>
                  <p className="text-sm text-slate-600">{enhancedDescription}</p>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, description: enhancedDescription }))}
                    className="mt-2 btn-primary text-sm w-full sm:w-auto"
                  >
                    Use This Description
                  </button>
                </div>
              )}
            </div>
          </div>

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
                <option value="Furniture">Furniture</option>
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
