import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Inventory from './pages/Inventory';
import BottomNavigationLayout from './components/layout/BottomNavigation/BottomNavigationLayout';
import Home from './pages/home';
import Login from './pages/login';
import Profile from './pages/Profile';
import TodoForm from './pages/TodoForm';
import KakaoCallback from './pages/KakaoCallback';

// import { type PropsWithChildren, useEffect } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from './contexts/AuthContext';
// import Splash from './components/common/Splash';

// 인증 로직 임시 비활성화
/*
const PrivateRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Splash />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};
*/

const router = createBrowserRouter([
  {
    path: '/',
    element: <BottomNavigationLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  {
    path: '/todoform',
    element: <TodoForm />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/auth/kakao/callback',
    element: <KakaoCallback />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
