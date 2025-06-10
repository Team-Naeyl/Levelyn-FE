import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Levelyn</h1>,
    errorElement: <div>오류!</div>,
    children: [],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
