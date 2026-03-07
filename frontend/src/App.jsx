import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import SuperAdminLogin from './pages/SuperAdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRooms from './pages/admin/AdminRooms';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminNotices from './pages/admin/AdminNotices';
import SuperAdmin from './pages/admin/SuperAdmin';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentRooms from './pages/student/StudentRooms';
import StudentPayments from './pages/student/StudentPayments';
import StudentComplaints from './pages/student/StudentComplaints';
import StudentNotices from './pages/student/StudentNotices';
import Layout from './components/Layout';
import AdminRouteWrapper from './components/AdminRouteWrapper';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Login Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to={user.email === 'gajula@gmail.com' ? '/admin/super-admin' : user.role === 'admin' ? '/admin' : '/student'} replace />} />
        <Route path="/super-admin-login" element={!user ? <SuperAdminLogin /> : <Navigate to="/admin/super-admin" replace />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={['admin']}><AdminRouteWrapper><AdminDashboard /></AdminRouteWrapper></ProtectedRoute>}
        />
        <Route
          path="/admin/rooms"
          element={<ProtectedRoute allowedRoles={['admin']}><AdminRouteWrapper><AdminRooms /></AdminRouteWrapper></ProtectedRoute>}
        />
        <Route
          path="/admin/complaints"
          element={<ProtectedRoute allowedRoles={['admin']}><AdminRouteWrapper><AdminComplaints /></AdminRouteWrapper></ProtectedRoute>}
        />
        <Route
          path="/admin/transactions"
          element={<ProtectedRoute allowedRoles={['admin']}><AdminRouteWrapper><AdminTransactions /></AdminRouteWrapper></ProtectedRoute>}
        />
        <Route
          path="/admin/notices"
          element={<ProtectedRoute allowedRoles={['admin']}><AdminRouteWrapper><AdminNotices /></AdminRouteWrapper></ProtectedRoute>}
        />
        <Route
          path="/admin/super-admin"
          element={<ProtectedRoute allowedRoles={['admin']}><SuperAdmin /></ProtectedRoute>}
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>}
        />
        <Route
          path="/student/rooms"
          element={<ProtectedRoute allowedRoles={['student']}><StudentRooms /></ProtectedRoute>}
        />
        <Route
          path="/student/payments"
          element={<ProtectedRoute allowedRoles={['student']}><StudentPayments /></ProtectedRoute>}
        />
        <Route
          path="/student/complaints"
          element={<ProtectedRoute allowedRoles={['student']}><StudentComplaints /></ProtectedRoute>}
        />
        <Route
          path="/student/notices"
          element={<ProtectedRoute allowedRoles={['student']}><StudentNotices /></ProtectedRoute>}
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
