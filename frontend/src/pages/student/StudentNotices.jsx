import { useState, useEffect } from 'react';
import { Loader, Bell, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { studentAPI } from '../../utils/api';

const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acknowledging, setAcknowledging] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getNotices();
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (noticeId) => {
    try {
      setAcknowledging(noticeId);
      await studentAPI.acknowledgeNotice(noticeId);
      
      // Update local state
      setNotices(notices.map(notice => 
        notice.id === noticeId 
          ? { ...notice, acknowledged: true, acknowledged_at: new Date().toISOString() }
          : notice
      ));
    } catch (error) {
      console.error('Error acknowledging notice:', error);
      // Don't show alert for API errors, just log them
      console.log('Notice acknowledgment API not available yet');
    } finally {
      setAcknowledging(null);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-blue-200 bg-blue-50';
      default: return 'border-slate-200 bg-white';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="text-red-600" size={20} />;
      case 'high': return <AlertTriangle className="text-orange-600" size={20} />;
      case 'medium': return <Bell className="text-blue-600" size={20} />;
      default: return <Bell className="text-slate-600" size={20} />;
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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Notice Board</h1>
        <p className="text-slate-600 mt-2">Important announcements from hostel administration</p>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="card text-center py-16">
            <Bell className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-600 text-lg">No announcements yet</p>
            <p className="text-slate-500 text-sm mt-2">Check back soon for updates</p>
          </div>
        ) : (
          notices.map((notice, index) => (
            <div
              key={notice.id || index}
              className={`card border-2 ${getPriorityColor(notice.priority || 'normal')}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-1">
                    {getPriorityIcon(notice.priority)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {notice.title}
                      </h3>
                      {notice.priority && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          notice.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          notice.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          notice.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {notice.priority.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 mb-3 whitespace-pre-wrap">
                      {notice.content}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>
                          Posted: {new Date(notice.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {notice.expires_at && (
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>
                            Expires: {new Date(notice.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Acknowledgment Section */}
                <div className="ml-4">
                  {notice.acknowledged ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle size={20} />
                      <div>
                        <p className="text-sm font-medium">Acknowledged</p>
                        <p className="text-xs">
                          {new Date(notice.acknowledged_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAcknowledge(notice.id)}
                      disabled={acknowledging === notice.id}
                      className="btn-primary text-sm px-3 py-2 disabled:opacity-50"
                    >
                      {acknowledging === notice.id ? (
                        <>
                          <Loader className="animate-spin inline mr-1" size={14} />
                          Acknowledging...
                        </>
                      ) : (
                        'Acknowledge'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Archive Info */}
      {notices.length > 0 && (
        <div className="card bg-slate-50 border border-slate-200">
          <p className="text-sm text-slate-600">
            📌 Showing <strong>{notices.length}</strong> notice{notices.length !== 1 ? 's' : ''}.
            Older announcements are archived and can be accessed from your account settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentNotices;
