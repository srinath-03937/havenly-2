import React from 'react';

const SimpleApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Havenly</h1>
          <p className="text-slate-600">Hostel Management System</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">🚀 Deployment Status</h3>
            <p className="text-blue-700 text-sm">
              Your Havenly application has been successfully deployed to Vercel!
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">✅ What's Working</h3>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Frontend deployed successfully</li>
              <li>• React app loading correctly</li>
              <li>• UI components rendered</li>
              <li>• Responsive design active</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">🔧 Next Steps</h3>
            <p className="text-yellow-700 text-sm mb-3">
              To enable full functionality, add environment variables to your Vercel project:
            </p>
            <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
              <li>Go to Vercel Dashboard</li>
              <li>Select your project</li>
              <li>Add environment variables</li>
              <li>Redeploy the application</li>
            </ol>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">📱 Features Available</h3>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• User Authentication (JWT)</li>
              <li>• Admin Dashboard</li>
              <li>• Student Portal</li>
              <li>• Room Management</li>
              <li>• Complaint System</li>
              <li>• Payment Processing</li>
              <li>• AI Integration</li>
            </ul>
          </div>
          
          <button
            onClick={() => window.location.href = '/api/health'}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Test API Health
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleApp;
