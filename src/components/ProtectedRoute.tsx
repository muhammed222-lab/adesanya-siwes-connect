
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If the user's role is not allowed, redirect to their dashboard
    let redirectTo = '/';
    
    switch (user.role) {
      case 'student':
        redirectTo = '/student/dashboard';
        break;
      case 'supervisor':
        redirectTo = '/supervisor/dashboard';
        break;
      case 'coordinator':
        redirectTo = '/coordinator/dashboard';
        break;
      default:
        redirectTo = '/';
    }
    
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
