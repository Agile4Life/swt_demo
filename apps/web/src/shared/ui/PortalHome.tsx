import { Navigate } from 'react-router-dom';
import { getCurrentUser, homePath } from '../api/client';

export function PortalHome() {
  const user = getCurrentUser();
  return <Navigate to={user ? homePath(user.role) : '/login'} replace />;
}
