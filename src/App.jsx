import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const Login = lazy(() => import('./modules/auth/pages/Login'));
const Register = lazy(() => import('./modules/auth/pages/Register'));
const ForgotPassword = lazy(() => import('./modules/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./modules/auth/pages/ResetPassword'));
const TrainerDashboard = lazy(() => import('./modules/trainer/pages/TrainerDashboard'));
const DigitalClassroom = lazy(() => import('./modules/trainer/pages/DigitalClassroom'));
const SessionRecordings = lazy(() => import('./modules/trainer/pages/SessionRecordings')); // <-- 🆕 Lazy load the new recordings page

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-slate-50">
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Main Application Authenticated Routes */}
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

            {/* Session Recordings Route */}
            <Route path="/session-recordings" element={ // <-- 🆕 Protected route for the recordings view
              <ProtectedRoute>
                <SessionRecordings />
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