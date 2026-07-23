import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './layouts/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

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

function App() {
  const userRole = localStorage.getItem('user_role') || 'Student';

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen items-center justify-center text-slate-500 font-medium">Loading...</div>}>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Full-Screen Meeting Room */}
          <Route path="/live-session/:sessionId" element={
            <ProtectedRoute allowedRoles={['Student', 'Teacher', 'Trainer', 'Admin']}>
              <LiveClassroomPage />
            </ProtectedRoute>
          } />

          {/* Role-Based Navigation Routes */}
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['Trainer', 'Admin']}>
              <AppLayout><TrainerDashboard /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/digital-classroom" element={
            <ProtectedRoute allowedRoles={['Student', 'Teacher', 'Trainer', 'Admin']}>
              <AppLayout><DigitalClassroom /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/attendance" element={
            <ProtectedRoute allowedRoles={['Trainer', 'Admin']}>
              <AppLayout><AttendanceDashboard /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/session-recordings" element={ 
            <ProtectedRoute allowedRoles={['Trainer', 'Admin']}>
              <AppLayout><SessionRecordings /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/session-management" element={
            <ProtectedRoute allowedRoles={['Trainer', 'Admin']}>
              <AppLayout><SessionManagement /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Smart Fallback Navigation */}
          <Route path="*" element={<Navigate to={userRole === 'Student' ? "/digital-classroom" : "/"} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;