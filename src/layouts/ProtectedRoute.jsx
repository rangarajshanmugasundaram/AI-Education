import { Navigate, Outlet } from 'react-router-dom';
import AccessDenied from '../components/AccessDenied';
import { useAuth } from '../hooks/useAuth';

/**
 * Role-Based Access Control (RBAC) Router Guard
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <AccessDenied />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;