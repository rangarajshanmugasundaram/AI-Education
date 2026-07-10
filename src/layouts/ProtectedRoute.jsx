import { Navigate } from 'react-router-dom';
import AppLayout from './AppLayout'; 
import AccessDenied from '../components/AccessDenied'; 

/**
 * Role-Based Access Control (RBAC) Router Guard
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  
  const userRole = localStorage.getItem("userRole") || "Student"; 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <AppLayout>
        <AccessDenied />
      </AppLayout>
    );
  }

  return <AppLayout>{children}</AppLayout>;
};

export default ProtectedRoute;