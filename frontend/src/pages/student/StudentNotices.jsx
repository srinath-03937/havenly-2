import { useState, useEffect } from 'react';
import { Loader, Bell } from 'lucide-react';
import { studentAPI } from '../../utils/api';

const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

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
              key={notice.id}
              className="card border-l-4 border-indigo-600 hover:shadow-md transition animation"
              style={{
                animation: `slideIn 0.3s ease-out`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900">{notice.title}</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    📅 {(notice.date && (notice.date.toDate ? notice.date.toDate() : new Date(notice.date))).toLocaleDateString()}
                    {notice.createdBy && ` • Posted by ${notice.createdBy.name}`}
                  </p>
                </div>
                <div className="ml-4 text-indigo-600">
                  <Bell size={24} />
                </div>
              </div>

              <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                {notice.content}
              </p>

              {/* Badge for recent notices */}
              {Math.round((Date.now() - new Date(notice.date).getTime()) / (1000 * 60 * 60 * 24)) <= 1 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                    🆕 New
                  </span>
                </div>
              )}
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

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default StudentNotices;
