import styled from '@emotion/styled';
import type { InventoryItem } from '../../../types/inventory.types';
import ItemBox from '../../../components/common/ItemBox';

type InventoryGridProps = {
  data: InventoryItem[];
  isEquipped?: boolean;
  onItemClick: (item: InventoryItem) => void;
  onTouchStart: (item: InventoryItem) => (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchCancel: (e: React.TouchEvent) => void;
  isDragging: boolean;
};

export default function InventoryGrid({
  data,
  isEquipped = false,
  onItemClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
  isDragging,
}: InventoryGridProps) {
  return (
    <Grid
      onTouchCancel={onTouchCancel}
      style={{ touchAction: 'none' }}
    >
      {data.map((el) => (
        <StyledItemBox
          key={el.id}
          imageURL={el.imageURL}
          equipped={isEquipped}
          isEquipped={isEquipped}
          isDragging={isDragging}
          onClick={() => onItemClick(el)}
          onTouchStart={onTouchStart(el)}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchCancel}
        />
      ))}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  width: 100%;
  padding: 8px;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  touch-action: none;
`;

const StyledItemBox = styled(ItemBox)<{ isDragging: boolean; isEquipped?: boolean }>`
  opacity: ${({ isDragging }) => (isDragging ? 0.6 : 1)};
  touch-action: none;
  cursor: ${({ isDragging }) => (isDragging ? 'grabbing' : 'pointer')};
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.gray[400]};
  overflow-x: auto;
  animation: ${({ isEquipped }) => (isEquipped ? 'grayPulse' : 'borderGlow')} 1.8s infinite alternate;

  @keyframes borderGlow {
    0% {
      border-color: ${({ theme }) => theme.colors.gray[400]};
      box-shadow: none;
    }
    70% {
      border-color: ${({ theme }) => theme.colors.primary[400]};
      box-shadow: 0 0 1px 0 ${({ theme }) => theme.colors.primary[400]};
    }
    100% {
      border-color: ${({ theme }) => theme.colors.gray[400]};
      box-shadow: none;
    }
  }

  @keyframes grayPulse {
    0% {
      border-color: ${({ theme }) => theme.colors.gray[400]};
    }
    70% {
      border-color: ${({ theme }) => theme.colors.gray[200]};
      box-shadow: 0 0 1px 0 ${({ theme }) => theme.colors.gray[400]};
    }
    100% {
      border-color: ${({ theme }) => theme.colors.gray[400]};
    }
  }
`;
