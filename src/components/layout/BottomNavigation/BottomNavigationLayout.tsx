import { Outlet } from 'react-router-dom';
import { BottomNavigation } from './_components/BottomNavigation';

export default function BottomNavigationLayout() {
  return (
    <>
      <Outlet />
      <BottomNavigation />
    </>
  );
}
