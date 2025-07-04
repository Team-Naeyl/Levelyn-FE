import { type PropsWithChildren, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import Inventory from './pages/Inventory';
import BottomNavigationLayout from './components/layout/BottomNavigation/BottomNavigationLayout';
import Home from './pages/home';
import Login from './pages/login';
import { useAuth } from './contexts/AuthContext';
import Profile from './pages/Profile';
import CreateTodo from './pages/CreateTodo';
import KakaoCallback from './pages/KakaoCallback';
import EditTodo from './pages/EditTodo';
import ErrorPage from './pages/ErrorPage';

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading || !isLoggedIn) {
    return <div>로딩 중...</div>;
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
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'inventory',
        element: <Inventory />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/todo/create',
    element: <CreateTodo />,
  },
  {
    path: '/todo/edit',
    element: <EditTodo />,
  },
]);

const loggedOutRouter = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/auth/kakao/callback',
    element: <KakaoCallback />,
  },
  {
    path: '*',
    element: <Login />,
  },
]);

export default function App() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return <RouterProvider router={isLoggedIn ? loggedInRouter : loggedOutRouter} />;
}
