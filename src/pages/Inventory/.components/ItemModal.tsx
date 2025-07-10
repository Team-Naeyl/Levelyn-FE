import styled from '@emotion/styled';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import addIcon from '@iconify-icons/material-symbols/add';
import closeIcon from '@iconify-icons/material-symbols/close';
import Button from '../../../components/common/Button';

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  imageURL: string;
  equipped: boolean;
}

interface ItemModalProps {
  item: InventoryItem;
  open: boolean;
  onClose: () => void;
  onToggleEquip: () => void;
}

export default function ItemModal({ item, open, onClose, onToggleEquip }: ItemModalProps) {
  if (!open) return null;

  const isEquipped = item.equipped;

  return createPortal(
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Header>
          <CloseButton onClick={onClose}>
            <Icon icon={closeIcon} />
          </CloseButton>
        </Header>
        <Image
          src={item.imageURL}
          alt={item.name}
        />
        <hr />
        <Title>{item.name}</Title>
        <Description>{item.description}</Description>

        <Button
          onClick={onToggleEquip}
          label={isEquipped ? '장착 해제' : '장착'}
          icon={<Icon icon={isEquipped ? closeIcon : addIcon} />}
          color={isEquipped ? 'error' : 'primary'}
          fullWidth
        />
      </Dialog>
    </Overlay>,
    document.body
  );
}

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 24px;
  border-radius: 12px;
  width: 300px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: right;
`;

export const CloseButton = styled.button`
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[600]};
`;

export const Image = styled.img`
  width: 64px;
  height: 64px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  ${({ theme }) => theme.textStyles.T_SB_20};
  text-align: center;
  color: ${({ theme }) => theme.colors.black};
`;

export const Description = styled.p`
  ${({ theme }) => theme.textStyles.B_R_14};
  text-align: center;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.gray[600]};
`;
