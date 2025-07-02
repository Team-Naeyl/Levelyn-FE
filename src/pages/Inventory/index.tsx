import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import ItemBox from '../../components/common/ItemBox';
import Header from '../../components/common/Header';
import ItemModal from './.components/ItemModal';
import api from '../../services/api';

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
      try {
        const [itemsRes, skillsRes] = await Promise.all([
          api.get('/api/inventory/items'),
          api.get('/api/inventory/skills'),
        ]);
        const imageURL = 'https://picsum.photos/seed/item1/64';

        const items: InventoryItem[] = itemsRes.data.results.map((item: InventoryItem) => ({
          ...item,
          imageURL,
        }));

        const skills: InventoryItem[] = skillsRes.data.userSkills.map((skill: InventoryItem) => ({
          ...skill,
          imageURL,
        }));

        setEquippedItems(items.filter((i) => i.equipped));
        setUnequippedItems(items.filter((i) => !i.equipped));
        setEquippedSkills(skills.filter((s) => s.equipped));
        setUnequippedSkills(skills.filter((s) => !s.equipped));
      } catch (err) {
        console.error('인벤토리 데이터 로딩 실패:', err);
      }
    };

    fetchInventory();
  }, []);

  const handleEquip = async (id: number, type: InventoryTab): Promise<void> => {
    console.log('하얏');
    console.log(id);
    try {
      if (type === 'skill') {
        const newEquipped = equippedSkills.some((s) => s.id === id)
          ? equippedSkills.filter((s) => s.id !== id)
          : [...equippedSkills, unequippedSkills.find((s) => s.id === id)!];

        if (newEquipped.length > 3) {
          alert('스킬은 최대 3개까지만 장착할 수 있습니다.');
          return;
        }

        await api.put('/api/inventory/skills/slot', {
          skillIds: newEquipped.map((s) => s.id),
        });

        const newUnequipped = [...unequippedSkills, ...equippedSkills.filter((s) => !newEquipped.includes(s))].filter(
          (s) => !newEquipped.some((e) => e.id === s.id)
        );

        setEquippedSkills(newEquipped);
        setUnequippedSkills(newUnequipped);
      } else {
        const result = await api.patch('/api/inventory/items/slot', { itemIds: [id] });
        console.log(result);
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
    }
  };

  const openModal = (item: InventoryItem): void => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setSelectedItem(null);
    setIsModalOpen(false);
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
          >
            스킬
          </TabButton>
          <TabButton
            selected={tab === 'item'}
            onClick={() => setTab('item')}
          >
            아이템
          </TabButton>
        </TabSelector>
      </Menu>

      <main>
        <Grid>
          {equippedData[tab].map((el) => (
            <ItemBox
              key={el.id}
              imageURL={el.imageURL}
              equipped={true}
              onClick={() => openModal(el)}
            />
          ))}
        </Grid>
        <Divider />
        <Grid>
          {unequippedData[tab].map((el) => (
            <ItemBox
              key={el.id}
              imageURL={el.imageURL}
              onClick={() => openModal(el)}
            />
          ))}
        </Grid>
      </main>

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          open={isModalOpen}
          onClose={closeModal}
          onToggleEquip={() => {
            handleEquip(selectedItem.id, tab);
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
  transition: background-color 0.2s ease;

  border-right: 1px solid ${({ theme }) => theme.colors.black};
  &:last-of-type {
    border-right: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;

const Grid = styled.div`
  display: grid;
  padding: 20px;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const Divider = styled.hr`
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};
`;
