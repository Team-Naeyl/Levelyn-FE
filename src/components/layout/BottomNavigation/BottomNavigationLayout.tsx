import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import { BottomNavigation } from './_components/BottomNavigation';

export default function BottomNavigationLayout() {
  return (
    <LayoutWrapper>
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
      <BottomNavigation />
    </LayoutWrapper>
  );
}

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding-bottom: 80px; // BottomNavigation 가리기 방지
`;
