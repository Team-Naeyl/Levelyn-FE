import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Inventory from './pages/Inventory';
import BottomNavigationLayout from './components/layout/BottomNavigation/BottomNavigationLayout';

const Header = styled.header`
  ${({ theme }) => css`
    ${theme.textStyles.H_B_32};
    color: ${theme.colors.primary[700]};
  `}
`;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Header>Style Test</Header>,
    errorElement: <div>오류!</div>,
    children: [],
  },
  {
    path: 'inventory',
    element: <BottomNavigationLayout />,
    children: [
      {
        index: true,
        element: <Inventory />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
