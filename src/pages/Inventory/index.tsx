import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import ItemBox from '../../components/common/ItemBox';
import Header from '../../components/common/Header';
import ItemModal from './.components/ItemModal';
import {
  getInventoryItems,
  getInventorySkills,
  updateEquippedSkills,
  updateEquippedItems,
} from '../../services/inventory';
import { getImageUrl } from '../../services/appwrite';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

type InventoryTab = 'skill' | 'item';

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  imageURL: string;
  equipped: boolean;
}

export default function InventoryPage() {
  const [tab, setTab] = useState<InventoryTab>('skill');

  const [equippedItems, setEquippedItems] = useState<InventoryItem[]>([]);
  const [unequippedItems, setUnequippedItems] = useState<InventoryItem[]>([]);
  const [equippedSkills, setEquippedSkills] = useState<InventoryItem[]>([]);
  const [unequippedSkills, setUnequippedSkills] = useState<InventoryItem[]>([]);

  const [isLoading, setIsLoading] = useState(false); // 목록 조회용
  const [isActionLoading, setIsActionLoading] = useState(false); // 장착/해제용
  const [error, setError] = useState<string | null>(null);

  const equippedData = {
    skill: equippedSkills,
    item: equippedItems,
  } as const;

  const unequippedData = {
    skill: unequippedSkills,
    item: unequippedItems,
  } as const;

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const itemsResult = await getInventoryItems();
        const skillsResult = await getInventorySkills();

        const items: InventoryItem[] = itemsResult.map((item: InventoryItem) => ({
          ...item,
          imageURL: getImageUrl(`weapon-${item.id}`),
        }));

        const skills: InventoryItem[] = skillsResult.map((skill) => ({
          ...skill,
          imageURL: getImageUrl(`skill-${skill.id}`),
        }));

        setEquippedItems(items.filter((i) => i.equipped));
        setUnequippedItems(items.filter((i) => !i.equipped));
        setEquippedSkills(skills.filter((s) => s.equipped));
        setUnequippedSkills(skills.filter((s) => !s.equipped));
      } catch (err) {
        setError('인벤토리 데이터 로딩에 실패했습니다.');
        console.error('인벤토리 데이터 로딩 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleEquip = async (id: number, type: InventoryTab): Promise<void> => {
    if (isActionLoading) return;

    setIsActionLoading(true);
    try {
      if (type === 'skill') {
        const newEquipped = equippedSkills.some((s) => s.id === id)
          ? equippedSkills.filter((s) => s.id !== id)
          : [...equippedSkills, unequippedSkills.find((s) => s.id === id)!];

        if (newEquipped.length > 3) {
          alert('스킬은 최대 3개까지만 장착할 수 있습니다.');
          return;
        }

        await updateEquippedSkills(newEquipped.map((s) => s.id));

        const newUnequipped = [...unequippedSkills, ...equippedSkills.filter((s) => !newEquipped.includes(s))].filter(
          (s) => !newEquipped.some((e) => e.id === s.id)
        );

        setEquippedSkills(newEquipped);
        setUnequippedSkills(newUnequipped);
      } else {
        await updateEquippedItems([id]);
        setEquippedItems((prev) =>
          prev.some((i) => i.id === id)
            ? prev.filter((i) => i.id !== id)
            : [...prev, unequippedItems.find((i) => i.id === id)!]
        );
        setUnequippedItems((prev) =>
          prev.some((i) => i.id === id)
            ? prev.filter((i) => i.id !== id)
            : [...prev, equippedItems.find((i) => i.id === id)!]
        );
      }
    } catch (err) {
      console.error('장착 요청 실패', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const openModal = (item: InventoryItem): void => {
    if (isActionLoading) return;
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const { onTouchStart, onTouchEnd, onTouchCancel, isDragging } = useDragAndDrop<InventoryItem>();

  const handleDrop = async (item: InventoryItem) => {
    if (isActionLoading) return;
    await handleEquip(item.id, tab);
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

      <MainArea>
        {isLoading ? (
          <CenterText>스킬/아이템 목록을 가져오는 중...</CenterText>
        ) : error ? (
          <ErrorText>{error}</ErrorText>
        ) : (
          <>
            <Grid
              {...{
                onTouchEnd: onTouchEnd(handleDrop),
                onTouchCancel,
                style: { touchAction: 'none' },
              }}
            >
              {equippedData[tab].map((el) => (
                <ItemBox
                  key={el.id}
                  imageURL={el.imageURL}
                  equipped={true}
                  onClick={() => openModal(el)}
                  {...{
                    onTouchStart: onTouchStart(el),
                    onTouchEnd: onTouchEnd(handleDrop),
                    onTouchCancel,
                    style: {
                      opacity: isDragging ? 0.6 : 1,
                      touchAction: 'none',
                      cursor: isDragging ? 'grabbing' : 'pointer',
                    },
                  }}
                />
              ))}
            </Grid>
            <Divider />
            <Grid
              {...{
                onTouchEnd: onTouchEnd(handleDrop),
                onTouchCancel,
                style: { touchAction: 'none' },
              }}
            >
              {unequippedData[tab].map((el) => (
                <ItemBox
                  key={el.id}
                  imageURL={el.imageURL}
                  onClick={() => openModal(el)}
                  {...{
                    onTouchStart: onTouchStart(el),
                    onTouchEnd: onTouchEnd(handleDrop),
                    onTouchCancel,
                    style: {
                      opacity: isDragging ? 0.6 : 1,
                      touchAction: 'none',
                      cursor: isDragging ? 'grabbing' : 'pointer',
                    },
                  }}
                />
              ))}
            </Grid>
          </>
        )}

        {isActionLoading && (
          <Overlay>
            <Spinner />
          </Overlay>
        )}
      </MainArea>

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

  &:hover:enabled {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const MainArea = styled.main`
  position: relative;
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
  color: #e53935;
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
