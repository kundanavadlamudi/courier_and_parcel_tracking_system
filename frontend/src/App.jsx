import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import BookParcelPage from './pages/BookParcelPage';
import TrackParcelPage from './pages/TrackParcelPage';
import ShipmentHistoryPage from './pages/ShipmentHistoryPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import FeedbackPage from './pages/FeedbackPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminParcelsPage from './pages/admin/AdminParcelsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminUpdateStatusPage from './pages/admin/AdminUpdateStatusPage';
import AdminManagementPage from './pages/admin/AdminManagementPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' },
          success: { iconTheme: { primary: '#f97316', secondary: '#fff' } }
        }} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/track-parcel" element={<TrackParcelPage publicMode />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

          {/* User Routes */}
          <Route path="/" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="book" element={<BookParcelPage />} />
            <Route path="track" element={<TrackParcelPage />} />
            <Route path="history" element={<ShipmentHistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="admins" element={<AdminManagementPage />} />
            <Route path="feedback" element={<AdminFeedbackPage />} />
            <Route path="parcels" element={<AdminParcelsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="update-status" element={<AdminUpdateStatusPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
