import { type PropsWithChildren, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useNavigate, Outlet } from 'react-router-dom';
import Inventory from './pages/Inventory';
import BottomNavigationLayout from './components/layout/BottomNavigation/BottomNavigationLayout';
import Home from './pages/home';
import Login from './pages/login';
import { useAuth } from './contexts/AuthContext';

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading || !isLoggedIn) {
    return <div>Loading...</div>;
  }

  return children;
};

const loggedInRouter = createBrowserRouter([
  {
    element: (
      <PrivateRoute>
        <BottomNavigationLayout />
      </PrivateRoute>
    ),
    errorElement: <div>오류!</div>,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'inventory',
        element: <Inventory />,
      },
    ],
  },
  {
    path: '*',
    element: <Home />,
  },
]);

const loggedOutRouter = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <Login />,
  },
]);

export default function App() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Global loading state
  }

  return <RouterProvider router={isLoggedIn ? loggedInRouter : loggedOutRouter} />;
}
