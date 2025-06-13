import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Icon } from '@iconify/react';
import homeIcon from '@iconify-icons/material-symbols/home';
import inventoryIcon from '@iconify-icons/material-symbols/backpack';
import profileIcon from '@iconify-icons/material-symbols/person';
import { css } from '@emotion/react';

interface NavItem {
  label: string;
  icon: any;
  key: string;
}

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItems = [
    { label: '인벤토리', icon: inventoryIcon, key: 'inventory', path: '/inventory' },
    { label: '홈', icon: homeIcon, key: 'home', path: '/' },
    { label: '프로필', icon: profileIcon, key: 'profile', path: '/profile' },
  ];

  return (
    <Wrapper>
      {navItems.map(({ label, icon, key, path }) => (
        <NavItem
          key={key}
          isSelected={pathname === path}
          onClick={() => navigate(path)}
        >
          <Icon
            icon={icon}
            width="24"
            height="24"
          />
          <span>{label}</span>
        </NavItem>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  ${({ theme }) => css`
    background-color: ${theme.colors.white};
    border-top: 1px solid ${theme.colors.gray[200]};
    position: fixed;
    bottom: 0;
    width: 100%;
    min-width: 320px;
    z-index: 5;
    display: flex;
    justify-content: center;
    gap: 10px;
  `}
`;

const NavItem = styled.button<{ isSelected: boolean }>`
  ${({ isSelected, theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    width: 100px;
    padding: 12px 24px;
    ${theme.textStyles.L_SB_12}
    cursor: pointer;
    border: none;
    background: none;
    color: ${isSelected ? theme.colors.primary[500] : theme.colors.gray[500]};
  `}
`;
