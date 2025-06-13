import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import { BottomNavigation } from './_components/BottomNavigation';

export default function BottomNavigationLayout() {
  return (
    <>
      <Outlet />
      <BottomNavigation />
    </>
  );
}
