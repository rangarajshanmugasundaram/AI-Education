import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout'; // <-- Import your layout component

const Login = lazy(() => import('./modules/auth/pages/Login'));
const Register = lazy(() => import('./modules/auth/pages/Register'));
const ForgotPassword = lazy(() => import('./modules/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./modules/auth/pages/ResetPassword'));
const TrainerDashboard = lazy(() => import('./modules/trainer/pages/TrainerDashboard'));
const DigitalClassroom = lazy(() => import('./modules/trainer/pages/DigitalClassroom'));
const SessionRecordings = lazy(() => import('./modules/trainer/pages/SessionRecordings')); 
const SessionManagement = lazy(() => import('./modules/trainer/pages/SessionManagement')); 

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn");
  
  // Wrap all authenticated components automatically within the AppLayout
  return isAuthenticated ? <AppLayout>{children}</AppLayout> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-slate-50">
        <Suspense fallback={<div className="flex h-screen items-center justify-center text-slate-500 font-medium">Loading...</div>}>
          <Routes>
            {/* Guest Authentication Routes (No Sidebar or Header) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Authenticated Workspace Routes (Wrapped with Sidebar & Header) */}
            <Route path="/" element={
              <ProtectedRoute>
                <TrainerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/digital-classroom" element={
              <ProtectedRoute>
                <DigitalClassroom />
              </ProtectedRoute>
            } />

            <Route path="/session-recordings" element={ 
              <ProtectedRoute>
                <SessionRecordings />
              </ProtectedRoute>
            } />

            <Route path="/session-management" element={
              <ProtectedRoute>
                <SessionManagement />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;