import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Inventory from './pages/Inventory';
import BottomNavigationLayout from './components/layout/BottomNavigation/BottomNavigationLayout';
import Home from './pages/home';
import TodoForm from './pages/TodoForm';

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
  {
    path: 'todoform',
    element: <TodoForm />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
