import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import { Icon } from '@iconify/react';
import backIcon from '@iconify-icons/material-symbols/chevron-left-rounded';
import deleteIcon from '@iconify-icons/material-symbols/delete-outline-rounded';
import { useTheme } from '@emotion/react';

interface HeaderProps {
  isMain?: boolean;
  title?: string;
  onBack?: () => void;
  onDelete?: () => void;
}

export default function Header({ isMain = true, title, onBack, onDelete }: HeaderProps) {
  const theme = useTheme();

  return (
    <>
      <HeaderContainer>
        {isMain ? (
          <MainTitle>Levelyn</MainTitle>
        ) : (
          <>
            <Side>
              {onBack && (
                <IconButton onClick={onBack}>
                  <Icon
                    icon={backIcon}
                    fontSize={'36px'}
                  />
                </IconButton>
              )}
            </Side>
            <Title>{title}</Title>
            <Side>
              {onDelete && (
                <IconButton onClick={onDelete}>
                  <Icon
                    icon={deleteIcon}
                    color={theme.colors.gray[500]}
                    fontSize={'24px'}
                  />
                </IconButton>
              )}
            </Side>
          </>
        )}
      </HeaderContainer>
      <Outlet />
    </>
  );
}

const HeaderContainer = styled.header`
  min-width: 320px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 12px;
`;

const Side = styled.div`
  width: 40px;
  display: flex;
  justify-content: center;
`;

const MainTitle = styled.div`
  ${({ theme }) => theme.textStyles.H_B_28};
  padding: 16px;
`;

const Title = styled.div`
  ${({ theme }) => theme.textStyles.H_B_16};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
