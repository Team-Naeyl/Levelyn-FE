import { css } from '@emotion/react';
import styled from '@emotion/styled';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>{children}</Container>
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

const Container = styled.div`
  ${({ theme }) => css`
    background-color: white;
    padding: 24px;
    border: 1px solid ${theme.colors.black};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 90%;
  `}
`;
