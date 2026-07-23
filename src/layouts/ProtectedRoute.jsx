import { Navigate, Outlet } from 'react-router-dom';
import AccessDenied from '../components/AccessDenied';

/**
 * Role-Based Access Control (RBAC) Router Guard
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole") || "Trainer";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <AccessDenied />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;