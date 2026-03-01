import { useState, useEffect } from 'react';
import { Plus, Loader, Wand2 } from 'lucide-react';
import { adminAPI, aiAPI } from '../../utils/api';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [idea, setIdea] = useState('');
  const [draftedContent, setDraftedContent] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [draftLoading, setDraftLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getNotices();
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDraft = async () => {
    if (!idea.trim()) {
      alert('Please enter an idea');
      return;
    }

    try {
      setDraftLoading(true);
      const response = await aiAPI.draftNotice({ idea });
      setDraftedContent(response.data.draftNotice);
    } catch (error) {
      alert('Error generating draft: ' + error.message);
    } finally {
      setDraftLoading(false);
    }
  };

  const useDraftContent = () => {
    setFormData({
      ...formData,
      content: draftedContent
    });
    setDraftedContent('');
    setIdea('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      await adminAPI.createNotice(formData);
      setFormData({ title: '', content: '' });
      setShowForm(false);
      await fetchNotices();
    } catch (error) {
      alert('Error creating notice: ' + error.message);
    } finally {
      setSubmitting(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Notice Board</h1>
          <p className="text-slate-600 mt-2">Publish announcements to all students</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Notice</span>
        </button>
      </div>

      {/* Create Notice Form */}
      {showForm && (
        <div className="card border-2 border-indigo-200 bg-indigo-50">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Publish New Notice</h2>

          {/* AI Draft Section */}
          <div className="mb-6 p-4 bg-white rounded-lg border border-indigo-300">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Wand2 size={20} className="text-indigo-600" />
              <span>AI-Powered Auto-Draft</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Brief Idea (e.g., "Water outage at 2pm", "Maintenance day tomorrow")
                </label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Enter a brief idea or topic..."
                  className="input-field h-20"
                />
              </div>

              <button
                type="button"
                onClick={generateDraft}
                disabled={draftLoading || !idea.trim()}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {draftLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={20} />
                    <span>Generate Professional Draft</span>
                  </>
                )}
              </button>

              {draftedContent && (
                <div className="mt-4 p-3 bg-slate-100 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 mb-2">AI-Generated Draft:</p>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap mb-3">
                    {draftedContent}
                  </p>
                  <button
                    type="button"
                    onClick={useDraftContent}
                    className="btn-primary text-sm"
                  >
                    Use This Draft
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Manual Notice Creation */}
          <form onSubmit={handleSubmit} className="space-y-4 border-t border-indigo-300 pt-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Notice title"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Notice content..."
                className="input-field h-32"
                required
              />
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? 'Publishing...' : 'Publish Notice'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ title: '', content: '' });
                  setDraftedContent('');
                  setIdea('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Published Notices */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Published Notices</h2>

        {notices.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-600 text-lg">No notices published yet</p>
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className="card border-l-4 border-indigo-600 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-slate-900">{notice.title}</h3>
                <span className="text-xs text-slate-500">
                  {(notice.date && (notice.date.toDate ? notice.date.toDate() : new Date(notice.date))).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-600 whitespace-pre-wrap leading-relaxed mb-3">
                {notice.content}
              </p>
              <p className="text-xs text-slate-500">
                Published by: {notice.createdBy?.name || 'Admin'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotices;
