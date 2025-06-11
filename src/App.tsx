import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

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
]);

export default function App() {
  return <RouterProvider router={router} />;
}
