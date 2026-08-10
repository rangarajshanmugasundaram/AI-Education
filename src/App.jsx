import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './layouts/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import { useAuth } from './hooks/useAuth';
import { ROLES } from './constants/roles';

const Login = lazy(() => import('./modules/auth/pages/Login'));
const Register = lazy(() => import('./modules/auth/pages/Register'));
const ForgotPassword = lazy(() => import('./modules/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./modules/auth/pages/ResetPassword'));
const TrainerDashboard = lazy(() => import('./modules/trainer/pages/TrainerDashboard'));
const DigitalClassroom = lazy(() => import('./modules/trainer/pages/DigitalClassroom'));
const SessionRecordings = lazy(() => import('./modules/trainer/pages/SessionRecordings')); 
const SessionManagement = lazy(() => import('./modules/trainer/pages/SessionManagement')); 
const AttendanceDashboard = lazy(() => import('./modules/attendance/pages/AttendanceDashboard'));
const LiveClassroomPage = lazy(() => import('./modules/trainer/pages/LiveClassroomPage'));

// NOTIFICATION MODULE PAGES
const NotificationDashboard = lazy(() => import('./modules/notifications/pages/NotificationDashboard'));
const StudentNotificationPanel = lazy(() => import('./modules/notifications/pages/StudentNotificationPanel'));

// ADMIN MODULE PAGES
const AdminDashboardPage = lazy(() => import('./modules/admin/pages/AdminDashboardPage'));
const UserManagementPage = lazy(() => import('./modules/admin/users/pages/UserManagementPage'));
const CourseManagementPage = lazy(() => import('./modules/admin/courses/pages/CourseManagementPage'));
const CourseDetailPage = lazy(() => import('./modules/admin/courses/pages/CourseDetailPage'));
const BatchManagementPage = lazy(() => import('./modules/admin/batches/pages/BatchManagementPage'));
const BatchDetailPage = lazy(() => import('./modules/admin/batches/pages/BatchDetailPage'));

// 🔴 TASK 5: ADMIN LIVE SESSION MONITORING
const LiveSessionsMonitoringPage = lazy(() => import('./modules/admin/liveSessions/pages/LiveSessionsMonitoringPage'));

function AppRoutes() {
  const { userRole } = useAuth();
  const roleLower = (userRole || '').toLowerCase();
  const isStudent = roleLower === ROLES.STUDENT.toLowerCase();
  const isAdmin = roleLower === ROLES.ADMIN.toLowerCase();

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Full-Screen Meeting Room */}
      <Route path="/live-session/:sessionId" element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.TEACHER, ROLES.TRAINER, ROLES.ADMIN]}>
          <LiveClassroomPage />
        </ProtectedRoute>
      } />

      {/* ADMIN ROUTES */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AppLayout><AdminDashboardPage /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AppLayout><UserManagementPage /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/courses" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AppLayout><CourseManagementPage /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/courses/:courseId" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AppLayout><CourseDetailPage /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/batches" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AppLayout><BatchManagementPage /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/batches/:batchId" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AppLayout><BatchDetailPage /></AppLayout>
        </ProtectedRoute>
      } />

      {/* 🔴 TASK 5: ADMIN LIVE MONITORING ROUTE */}
      <Route path="/admin/live-monitoring" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AppLayout><LiveSessionsMonitoringPage /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Role-Based Navigation Routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={[ROLES.TRAINER, ROLES.ADMIN]}>
          <AppLayout>
            {isAdmin ? <AdminDashboardPage /> : <TrainerDashboard />}
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/digital-classroom" element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.TEACHER, ROLES.TRAINER, ROLES.ADMIN]}>
          <AppLayout><DigitalClassroom /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/attendance" element={
        <ProtectedRoute allowedRoles={[ROLES.TRAINER, ROLES.ADMIN]}>
          <AppLayout><AttendanceDashboard /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/session-recordings" element={ 
        <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.TEACHER, ROLES.TRAINER, ROLES.ADMIN]}>
          <AppLayout><SessionRecordings /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/session-management" element={
        <ProtectedRoute allowedRoles={[ROLES.TRAINER, ROLES.ADMIN]}>
          <AppLayout><SessionManagement /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/notifications" element={
        <ProtectedRoute allowedRoles={[ROLES.TRAINER, ROLES.ADMIN]}>
          <AppLayout><NotificationDashboard /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/notifications-inbox" element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.TEACHER, ROLES.TRAINER, ROLES.ADMIN]}>
          <AppLayout><StudentNotificationPanel /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={isStudent ? "/digital-classroom" : (isAdmin ? "/admin/dashboard" : "/")} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen items-center justify-center text-slate-500 font-medium font-mono">Loading Admin Portal...</div>}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}