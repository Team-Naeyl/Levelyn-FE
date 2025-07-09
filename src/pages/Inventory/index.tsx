import { useState } from 'react';
import styled from '@emotion/styled';
import Header from '../../components/common/Header';
import ItemModal from './.components/ItemModal';
import InventoryGrid from './.components/InventoryGrid';
import EquippedAvatar from './.components/EquippedAvatar';
import { getImageUrl } from '../../services/appwrite';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import {
  useInventoryItems,
  useInventorySkills,
  useUpdateItemsMutation,
  useUpdateSkillsMutation,
} from '../../hooks/useInventory';
import type { InventoryItem } from '../../types/inventory.types';

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

  const handleDrop = async (item: InventoryItem) => {
    if (updateSkillsMutation.isPending || updateItemsMutation.isPending) return;
    await handleEquip(item.id, tab);
  };

  const { isDragging, draggedItem, dragPosition } = useDragAndDrop<InventoryItem>(handleDrop);

  const equippedDnD = useDragAndDrop<InventoryItem>(handleDrop);
  const unequippedDnD = useDragAndDrop<InventoryItem>(handleDrop);

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

  const handleTabClick = (type: number) => {
    setItemTabType(type);
  };

  const handleBoxClick = (item: InventoryItem) => {
    if (item.type) setItemTabType(item.type.id);
    openModal(item);
  };

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
              <EquippedAvatar
                slots={ITEM_TYPES.map((t) => ({
                  label: t.label,
                  item: equippedByType(t.type)
                    ? { id: equippedByType(t.type)!.id, imageURL: equippedByType(t.type)!.imageURL }
                    : null,
                  onClick: () => openModal(equippedByType(t.type)!),
                }))}
              />
              <EquipArea>
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
                <div ref={unequippedDnD.setDropZoneRef}>
                  <SectionTitle>장비 중인 아이템</SectionTitle>
                  {equippedByType(itemTabType) ? (
                    <InventoryGrid
                      data={equippedByType(itemTabType) ? [equippedByType(itemTabType)!] : []}
                      isEquipped={true}
                      isDragging={equippedDnD.isDragging}
                      onItemClick={openModal}
                      onTouchStart={equippedDnD.onTouchStart}
                      onTouchMove={equippedDnD.onTouchMove}
                      onTouchEnd={equippedDnD.onTouchEnd}
                      onTouchCancel={equippedDnD.onTouchCancel}
                    />
                  ) : (
                    <CenterText>장착된 아이템이 없습니다.</CenterText>
                  )}
                </div>
                <Divider />
                <div ref={equippedDnD.setDropZoneRef}>
                  {unequippedByType(itemTabType).length === 0 && (
                    <CenterText>장착 가능한 아이템이 없습니다.</CenterText>
                  )}
                  <InventoryGrid
                    data={unequippedByType(itemTabType)}
                    isDragging={unequippedDnD.isDragging}
                    onItemClick={openModal}
                    onTouchStart={unequippedDnD.onTouchStart}
                    onTouchMove={unequippedDnD.onTouchMove}
                    onTouchEnd={unequippedDnD.onTouchEnd}
                    onTouchCancel={unequippedDnD.onTouchCancel}
                  />
                </div>
              </EquipArea>
              {isDragging && draggedItem && dragPosition && (
                <DragPreview
                  style={{
                    left: dragPosition.x,
                    top: dragPosition.y,
                  }}
                />
              )}
              {isActionLoading && (
                <Overlay>
                  <Spinner />
                </Overlay>
              )}
            </>
          )}
          {tab === 'skill' && (
            <>
              <EquippedAvatar
                slots={[0, 1, 2].map((idx) => {
                  const equippedSkill = equippedData.skill[idx];
                  return {
                    label: `스킬 ${idx + 1}`,
                    item: equippedSkill ? { id: equippedSkill.id, imageURL: equippedSkill.imageURL } : null,
                    onClick: () => handleBoxClick(equippedSkill),
                  };
                })}
              />
              <EquipArea>
                <div ref={unequippedDnD.setDropZoneRef}>
                  <SectionTitle>장착 중인 스킬</SectionTitle>
                  {equippedData.skill.length === 0 && <CenterText>장착된 스킬이 없습니다.</CenterText>}
                  <InventoryGrid
                    data={equippedData.skill}
                    isEquipped={true}
                    isDragging={isDragging}
                    onItemClick={openModal}
                    onTouchStart={equippedDnD.onTouchStart}
                    onTouchMove={equippedDnD.onTouchMove}
                    onTouchEnd={equippedDnD.onTouchEnd}
                    onTouchCancel={equippedDnD.onTouchCancel}
                  />
                </div>
                <Divider />
                <div ref={equippedDnD.setDropZoneRef}>
                  {unequippedData.skill.length === 0 && <CenterText>장착 가능한 스킬이 없습니다.</CenterText>}
                  <InventoryGrid
                    data={unequippedData.skill}
                    isEquipped={false}
                    isDragging={isDragging}
                    onItemClick={openModal}
                    onTouchStart={unequippedDnD.onTouchStart}
                    onTouchMove={unequippedDnD.onTouchMove}
                    onTouchEnd={unequippedDnD.onTouchEnd}
                    onTouchCancel={unequippedDnD.onTouchCancel}
                  />
                </div>
              </EquipArea>
              {isActionLoading && (
                <Overlay>
                  <Spinner />
                </Overlay>
              )}
            </>
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

const BaseButton = styled.button`
  width: 100%;
  cursor: pointer;
  border: none;
  ${({ theme }) => theme.textStyles.T_SB_16};
  transition:
    background-color 0.2s,
    opacity 0.2s;
`;

const TabButton = styled(BaseButton)<{ selected?: boolean }>`
  padding: 8px;
  border-right: 1px solid ${({ theme }) => theme.colors.black};
  background-color: ${({ selected, theme }) => (selected ? theme.colors.gray[100] : 'transparent')};
  &:last-of-type {
    border-right: none;
  }
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

const TypeTabButton = styled(BaseButton)<{ active: boolean }>`
  padding: 6px 6px;
  border-radius: 2px;
  background: ${({ active, theme }) => (active ? theme.colors.primary[500] : 'transparent')};
  color: ${({ active, theme }) => (active ? theme.colors.white : theme.colors.gray[500])};
`;

const BaseLabel = styled.div`
  ${({ theme }) => theme.textStyles.T_SB_16};
`;

const SectionTitle = styled(BaseLabel)`
  padding: 0 8px;
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const EquipArea = styled.div`
  width: 320px;
  max-height: 306px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
`;

const CenterText = styled(BaseLabel)`
  height: 110px;
  width: 100%;
  text-align: center;
  padding: 40px 0;
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const ErrorText = styled(BaseLabel)`
  width: 100%;
  text-align: center;
  padding: 40px 0;
  color: ${({ theme }) => theme.colors.error[700]};
  font-weight: bold;
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
  border-top: 5px solid ${({ theme }) => theme.colors.primary[400]};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Divider = styled.hr`
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};
  width: 100%;
`;

const TypeTabRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const DragPreview = styled.div`
  pointer-events: none;
  position: fixed;
  z-index: 1555;
  width: 100px;
  height: 100px;
  background: ${({ theme }) => theme.colors.gray[500]}
  transition: opacity 0.2s;
`;
