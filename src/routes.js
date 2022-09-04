import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
//
import User from './pages/User';
import Login from './pages/Login';
import Groups from './pages/Groups';
import DashboardApp from './pages/DashboardApp';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'groups', element: <Groups /> },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
  ]);
}
