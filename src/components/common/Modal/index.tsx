import { css } from '@emotion/react';
import styled from '@emotion/styled';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  hasDefaultContainer?: boolean;
  noPadding?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  hasDefaultContainer = true,
  noPadding = false,
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Overlay onClick={onClose}>
      {hasDefaultContainer ? (
        <Container
          onClick={(e) => e.stopPropagation()}
          noPadding={noPadding}
        >
          {children}
        </Container>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ width: '90%' }}
        >
          {children}
        </div>
      )}
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Container = styled.div<{ noPadding?: boolean }>`
  ${({ theme, noPadding }) => css`
    background-color: white;
    padding: ${noPadding ? 0 : '16px'};
    border: 2px solid ${theme.colors.black};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 90%;
  `}
`;
