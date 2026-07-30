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

function AppRoutes() {
  const { userRole } = useAuth();
  const isStudent = userRole.toLowerCase() === ROLES.STUDENT.toLowerCase();

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

      {/* Role-Based Navigation Routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={[ROLES.TRAINER, ROLES.ADMIN]}>
          <AppLayout><TrainerDashboard /></AppLayout>
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

      {/* RECORDINGS ACCESSIBLE TO BOTH TRAINERS AND STUDENTS */}
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

      {/* TRAINER/ADMIN NOTIFICATION MANAGEMENT DASHBOARD */}
      <Route path="/notifications" element={
        <ProtectedRoute allowedRoles={[ROLES.TRAINER, ROLES.ADMIN]}>
          <AppLayout><NotificationDashboard /></AppLayout>
        </ProtectedRoute>
      } />

      {/* STUDENT NOTIFICATION PAGE */}
      <Route path="/notifications-inbox" element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.TEACHER, ROLES.TRAINER, ROLES.ADMIN]}>
          <AppLayout><StudentNotificationPanel /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Smart Fallback Navigation */}
      <Route path="*" element={<Navigate to={isStudent ? "/digital-classroom" : "/"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen items-center justify-center text-slate-500 font-medium">Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}