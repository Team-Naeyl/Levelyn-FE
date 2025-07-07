import styled from '@emotion/styled';
import avatar from '../../../assets/avatar.png';
import ItemBox from '../../../components/common/ItemBox';

type Slot = {
  label: string;
  item: { id: number; imageURL: string } | null;
  onClick: () => void;
};

type EquippedAreaProps = {
  slots: Slot[];
  avatarImg?: string;
};

export default function EquippedAvatar({ slots, avatarImg = avatar }: EquippedAreaProps) {
  return (
    <ItemArea>
      <AvatarCol>
        <AvatarImg
          src={avatarImg}
          alt="아바타"
        />
      </AvatarCol>
      <EquippedCol>
        {slots.map((slot, idx) => (
          <EquippedRow key={slot.label + idx}>
            <TypeLabel>{slot.label}</TypeLabel>
            {slot.item ? (
              <EquippedItemBox
                key={slot.item.id}
                imageURL={slot.item.imageURL}
                onClick={slot.onClick}
              />
            ) : (
              <EmptyBox></EmptyBox>
            )}
          </EquippedRow>
        ))}
      </EquippedCol>
    </ItemArea>
  );
}

const ItemArea = styled.div`
  height: 280px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
`;

const AvatarCol = styled.div`
  min-width: 160px;
`;

const AvatarImg = styled.img`
  width: 160px;
  height: 216px;
  object-fit: cover;
`;

const EquippedCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 6px;
`;

const EquippedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const EmptyBox = styled.div`
  width: 44px;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.gray[400]};
  color: ${({ theme }) => theme.colors.gray[400]};
  /* 반짝임 효과 */
  animation: emptyGlow 1.8s infinite alternate;

  @keyframes emptyGlow {
    0% {
      border-color: ${({ theme }) => theme.colors.gray[400]};
    }
    70% {
      border-color: ${({ theme }) => theme.colors.gray[700]};
      box-shadow: 0 0 1px 0 ${({ theme }) => theme.colors.gray[300]};
    }
    100% {
      border-color: ${({ theme }) => theme.colors.gray[400]};
    }
  }
`;

const EquippedItemBox = styled(ItemBox)`
  width: 44px;
  height: 44px;
`;

const TypeLabel = styled.div`
  ${({ theme }) => theme.textStyles.T_SB_16};
  color: ${({ theme }) => theme.colors.gray[500]};
`;
