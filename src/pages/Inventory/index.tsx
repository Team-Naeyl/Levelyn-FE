import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import ItemBox from '../../components/common/ItemBox';
import Header from '../../components/common/Header';
import ItemModal from './.components/ItemModal';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import {
  useInventoryItems,
  useInventorySkills,
  useUpdateItemsMutation,
  useUpdateSkillsMutation,
} from '../../hooks/useInventory';
import type { InventoryItem } from '../../types/inventory.types';
import avatar from '../../assets/avatar.png';

type InventoryTab = 'skill' | 'item';

const ITEM_TYPES = [
  { type: 1, label: '무기' },
  { type: 2, label: '팔찌' },
  { type: 3, label: '목걸이' },
  { type: 4, label: '반지' },
  { type: 5, label: '귀걸이' },
];

export default function InventoryPage() {
  const [tab, setTab] = useState<InventoryTab>('skill');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemTabType, setItemTabType] = useState<number>(1);

  const { data: items = [], isLoading: itemsLoading, error: itemsError } = useInventoryItems();
  const { data: skills = [], isLoading: skillsLoading, error: skillsError } = useInventorySkills();

  const updateSkillsMutation = useUpdateSkillsMutation();
  const updateItemsMutation = useUpdateItemsMutation();

  const equippedByType = (type: number) => items.find((item) => item.type.id === type && item.equipped);

  const unequippedByType = (type: number) => items.filter((item) => item.type.id === type && !item.equipped);

  const handleEquip = async (id: number, type: InventoryTab): Promise<void> => {
    if (type === 'skill') {
      if (updateSkillsMutation.isPending) return;
      const equippedSkills = skills.filter((s) => s.equipped);
      const unequippedSkills = skills.filter((s) => !s.equipped);
      const isEquipped = equippedSkills.some((s) => s.id === id);
      const newEquipped = isEquipped
        ? equippedSkills.filter((s) => s.id !== id)
        : [...equippedSkills, unequippedSkills.find((s) => s.id === id)!];

      if (newEquipped.length > 3) {
        alert('스킬은 최대 3개까지만 장착할 수 있습니다.');
        return;
      }

      await updateSkillsMutation.mutateAsync(newEquipped.map((s) => s.id));
    } else {
      if (updateItemsMutation.isPending) return;

      await updateItemsMutation.mutateAsync([id]);
    }
  };

  const openModal = (item: InventoryItem): void => {
    if (updateSkillsMutation.isPending || updateItemsMutation.isPending) return;
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  const closeModal = (): void => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const { onTouchStart, onTouchEnd, onTouchCancel, isDragging } = useDragAndDrop<InventoryItem>();
  const handleDrop = async (item: InventoryItem) => {
    if (updateSkillsMutation.isPending || updateItemsMutation.isPending) return;
    await handleEquip(item.id, tab);
  };

  const equippedData = {
    skill: skills.filter((s) => s.equipped),
    item: items.filter((i) => i.equipped),
  } as const;
  const unequippedData = {
    skill: skills.filter((s) => !s.equipped),
    item: items.filter((i) => !i.equipped),
  } as const;

  const isLoading = tab === 'item' ? itemsLoading : skillsLoading;
  const error = (tab === 'item' ? itemsError : skillsError) as Error | null;
  const isActionLoading = updateSkillsMutation.isPending || updateItemsMutation.isPending;

  const bottomAreaRef = useRef<HTMLDivElement>(null);
  const [pendingScroll, setPendingScroll] = useState(false);
  const bottomSkillAreaRef = useRef<HTMLDivElement>(null);
  const [pendingSkillScroll, setPendingSkillScroll] = useState(false);

  const handleTabClick = (type: number) => {
    setItemTabType(type);
    setPendingScroll(true);
  };

  const handleEmptyBoxClick = (type: number) => {
    setItemTabType(type);
    setPendingScroll(true);
  };

  const handleSkillEmptyBoxClick = () => {
    setPendingSkillScroll(true);
  };

  useEffect(() => {
    if (pendingScroll && bottomAreaRef.current) {
      bottomAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPendingScroll(false);
    }
  }, [itemTabType, pendingScroll]);

  useEffect(() => {
    if (pendingSkillScroll && bottomSkillAreaRef.current) {
      bottomSkillAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPendingSkillScroll(false);
    }
  }, [pendingSkillScroll]);

  return (
    <Wrapper>
      <Menu>
        <Header
          isMain={false}
          title="인벤토리"
        />
        <TabSelector>
          <TabButton
            selected={tab === 'skill'}
            onClick={() => setTab('skill')}
            disabled={isActionLoading}
          >
            스킬
          </TabButton>
          <TabButton
            selected={tab === 'item'}
            onClick={() => setTab('item')}
            disabled={isActionLoading}
          >
            아이템
          </TabButton>
        </TabSelector>
      </Menu>

      {isLoading ? (
        <CenterText>목록을 가져오는 중...</CenterText>
      ) : error ? (
        <ErrorText>{error.message || '데이터 로딩 실패'}</ErrorText>
      ) : (
        <>
          {tab === 'item' && (
            <>
              <ItemArea>
                <AvatarCol>
                  <AvatarImg
                    src={avatar}
                    alt="아바타"
                  />
                </AvatarCol>
                <EquippedCol>
                  {ITEM_TYPES.map((t) => (
                    <EquippedRow key={t.type}>
                      <TypeLabel>{t.label}</TypeLabel>
                      {equippedByType(t.type) ? (
                        <EquippedItemBox
                          key={equippedByType(t.type)!.id}
                          imageURL={equippedByType(t.type)!.imageURL}
                          onClick={() => openModal(equippedByType(t.type)!)}
                        />
                      ) : (
                        <EmptyBox onClick={() => handleEmptyBoxClick(t.type)}>+</EmptyBox>
                      )}
                    </EquippedRow>
                  ))}
                </EquippedCol>
              </ItemArea>
              <BottomArea ref={bottomAreaRef}>
                <TypeTabRow>
                  {ITEM_TYPES.map((t) => (
                    <TypeTabButton
                      key={t.type}
                      active={itemTabType === t.type}
                      onClick={() => handleTabClick(t.type)}
                    >
                      {t.label}
                    </TypeTabButton>
                  ))}
                </TypeTabRow>
                <SectionTitle>장비 중인 아이템</SectionTitle>
                {equippedByType(itemTabType) ? null : <CenterText>장착된 아이템이 없습니다.</CenterText>}
                <Grid
                  onTouchEnd={onTouchEnd(handleDrop)}
                  onTouchCancel={onTouchCancel}
                  style={{ touchAction: 'none' }}
                >
                  {equippedByType(itemTabType) && (
                    <ItemBox
                      key={equippedByType(itemTabType)!.id}
                      imageURL={equippedByType(itemTabType)!.imageURL}
                      equipped={true}
                      onClick={() => openModal(equippedByType(itemTabType)!)}
                      onTouchStart={onTouchStart(equippedByType(itemTabType)!)}
                      onTouchEnd={onTouchEnd(handleDrop)}
                      onTouchCancel={onTouchCancel}
                      style={{
                        opacity: isDragging ? 0.6 : 1,
                        touchAction: 'none',
                        cursor: isDragging ? 'grabbing' : 'pointer',
                      }}
                    />
                  )}
                </Grid>
                <Divider />
                {unequippedByType(itemTabType).length === 0 && <CenterText>장착 가능한 아이템이 없습니다.</CenterText>}
                <Grid
                  onTouchEnd={onTouchEnd(handleDrop)}
                  onTouchCancel={onTouchCancel}
                  style={{ touchAction: 'none' }}
                >
                  {unequippedByType(itemTabType).map((el) => (
                    <ItemBox
                      key={el.id}
                      imageURL={el.imageURL}
                      onClick={() => openModal(el)}
                      onTouchStart={onTouchStart(el)}
                      onTouchEnd={onTouchEnd(handleDrop)}
                      onTouchCancel={onTouchCancel}
                      style={{
                        opacity: isDragging ? 0.6 : 1,
                        touchAction: 'none',
                        cursor: isDragging ? 'grabbing' : 'pointer',
                      }}
                    />
                  ))}
                </Grid>
              </BottomArea>
              {isActionLoading && (
                <Overlay>
                  <Spinner />
                </Overlay>
              )}
            </>
          )}

          {tab === 'skill' && (
            <MainArea>
              <ItemArea>
                <AvatarCol>
                  <AvatarImg
                    src={avatar}
                    alt="아바타"
                  />
                </AvatarCol>
                <EquippedCol>
                  {[0, 1, 2].map((idx) => {
                    const equippedSkill = equippedData.skill[idx];
                    return (
                      <EquippedRow key={idx}>
                        <TypeLabel>스킬 {idx + 1}</TypeLabel>
                        {equippedSkill ? (
                          <EquippedItemBox
                            key={equippedSkill.id}
                            imageURL={equippedSkill.imageURL}
                            onClick={() => openModal(equippedSkill)}
                          />
                        ) : (
                          <EmptyBox onClick={handleSkillEmptyBoxClick}>+</EmptyBox>
                        )}
                      </EquippedRow>
                    );
                  })}
                </EquippedCol>
              </ItemArea>
              <BottomArea ref={bottomSkillAreaRef}>
                <SectionTitle>장착 중인 스킬</SectionTitle>
                {equippedData.skill.length === 0 && <CenterText>장착된 스킬이 없습니다.</CenterText>}
                <Grid
                  onTouchEnd={onTouchEnd(handleDrop)}
                  onTouchCancel={onTouchCancel}
                  style={{ touchAction: 'none' }}
                >
                  {equippedData.skill.map((el) => (
                    <ItemBox
                      key={el.id}
                      imageURL={el.imageURL}
                      equipped
                      onClick={() => openModal(el)}
                      onTouchStart={onTouchStart(el)}
                      onTouchEnd={onTouchEnd(handleDrop)}
                      onTouchCancel={onTouchCancel}
                      style={{
                        opacity: isDragging ? 0.6 : 1,
                        touchAction: 'none',
                        cursor: isDragging ? 'grabbing' : 'pointer',
                      }}
                    />
                  ))}
                </Grid>
                <Divider />
                {unequippedData.skill.length === 0 && <CenterText>장착 가능한 스킬이 없습니다.</CenterText>}
                <Grid
                  onTouchEnd={onTouchEnd(handleDrop)}
                  onTouchCancel={onTouchCancel}
                  style={{ touchAction: 'none' }}
                >
                  {unequippedData.skill.map((el) => (
                    <ItemBox
                      key={el.id}
                      imageURL={el.imageURL}
                      equipped={false}
                      onClick={() => openModal(el)}
                      onTouchStart={onTouchStart(el)}
                      onTouchEnd={onTouchEnd(handleDrop)}
                      onTouchCancel={onTouchCancel}
                      style={{
                        opacity: isDragging ? 0.6 : 1,
                        touchAction: 'none',
                        cursor: isDragging ? 'grabbing' : 'pointer',
                      }}
                    />
                  ))}
                </Grid>
              </BottomArea>
              {isActionLoading && (
                <Overlay>
                  <Spinner />
                </Overlay>
              )}
            </MainArea>
          )}
        </>
      )}

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          open={isModalOpen}
          onClose={closeModal}
          onToggleEquip={async () => {
            await handleEquip(selectedItem.id, tab);
            closeModal();
          }}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 320px;
`;

const Menu = styled.header`
  text-align: center;
`;

const TabSelector = styled.div`
  display: flex;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.black};
`;

const TabButton = styled.button<{ selected: boolean }>`
  width: 100%;
  padding: 8px;
  ${({ theme }) => theme.textStyles.B_R_14};
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    opacity 0.2s;
  border-right: 1px solid ${({ theme }) => theme.colors.black};
  &:last-of-type {
    border-right: none;
  }

  background-color: ${({ selected, theme }) => (selected ? theme.colors.gray[100] : 'transparent')};
`;

const MainArea = styled.main`
  min-height: 300px;
`;

const Grid = styled.div`
  display: grid;
  padding: 20px;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  touch-action: none;
`;

const Divider = styled.hr`
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};
`;

const CenterText = styled.div`
  width: 100%;
  text-align: center;
  padding: 40px 0;
  color: ${({ theme }) => theme.colors.gray[500]};
  ${({ theme }) => theme.textStyles.B_R_16};
`;

const ErrorText = styled.div`
  width: 100%;
  text-align: center;
  padding: 40px 0;
  color: ${({ theme }) => theme.colors.error[700]};
  font-weight: bold;
  ${({ theme }) => theme.textStyles.B_R_16};
`;

const Overlay = styled.div`
  position: absolute;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 5px solid ${({ theme }) => theme.colors.gray[200]};
  border-top: 5px solid ${({ theme }) => theme.colors.primary || '#3498db'};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SectionTitle = styled.div`
  ${({ theme }) => theme.textStyles.T_SB_16};
  margin: 12px 0 0 12px;
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const ItemArea = styled.div`
  height: 400px;
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
  height: 240px;
  object-fit: cover;
`;

const EquippedItemBox = styled(ItemBox)`
  width: 48px;
  height: 48px;
`;

const EquippedCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 12px;
`;

const EquippedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TypeLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray[500]};
  ${({ theme }) => theme.textStyles.T_SB_16};
`;

const EmptyBox = styled.div`
  width: 48px;
  height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.gray[500]};
  ${({ theme }) => theme.textStyles.H_B_24};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const BottomArea = styled.div`
  height: 3000px;
  margin-top: 16px;
`;

const TypeTabRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
`;

const TypeTabButton = styled.button<{ active: boolean }>`
  width: 100%;
  padding: 6px 6px;
  border: none;
  background: ${({ active, theme }) => (active ? theme.colors.gray[100] : 'transparent')};
  color: ${({ active, theme }) => (active ? theme.colors.black : theme.colors.gray[500])};
  cursor: pointer;
  ${({ theme }) => theme.textStyles.T_SB_16};
`;
