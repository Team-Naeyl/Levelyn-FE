import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Inventory from './pages/Inventory';
import BottomNavigationLayout from './components/layout/BottomNavigation/BottomNavigationLayout';
import Home from './pages/home';

const router = createBrowserRouter([
  {
    element: <BottomNavigationLayout />,
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
]);

export default function App() {
  return <RouterProvider router={router} />;
}
