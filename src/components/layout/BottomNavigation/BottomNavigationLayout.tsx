import { Outlet } from 'react-router-dom';
import BottomNavigation from './_components/BottomNavigation';
import styled from '@emotion/styled';

export default function BottomNavigationLayout() {
  return (
    <>
      <Main>
        <Outlet />
      </Main>
      <BottomNavigation />
    </>
  );
}

const Main = styled.main`
  padding-bottom: 64px;
`;
