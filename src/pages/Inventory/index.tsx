import { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { ItemBox } from '../../components/common/ItemBox';

type InventoryTab = 'skill' | 'item';

interface InventoryItem {
  id: number;
  imageURL: string;
  equipped: boolean;
}

export default function Inventory() {
  // TODO: API 서비스 연결 및 실제 스킬, 아이템 데이터 적용
  const [tab, setTab] = useState<InventoryTab>('skill');
  const initialSkills: InventoryItem[] = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    imageURL: `https://picsum.photos/seed/skill${i + 1}/64`,
    equipped: i < 3,
  }));

  const initialItems: InventoryItem[] = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    imageURL: `https://picsum.photos/seed/skill${i + 11}/64`,
    equipped: i < 3,
  }));

  const [skills, setSkills] = useState<InventoryItem[]>(initialItems);
  const [items, setItems] = useState<InventoryItem[]>(initialSkills);

  const handleUnequip = (id: number, type: InventoryTab) => {
    if (type === 'skill') {
      setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, equipped: false } : s)));
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, equipped: false } : i)));
    }
  };

  const equippedSkills = useMemo(() => skills.filter((s) => s.equipped), [skills]);
  const unequippedSkills = useMemo(() => skills.filter((s) => !s.equipped), [skills]);

  const equippedItems = useMemo(() => items.filter((i) => i.equipped), [items]);
  const unequippedItems = useMemo(() => items.filter((i) => !i.equipped), [items]);

  return (
    <Wrapper>
      <Header>
        <Title>인벤토리</Title>
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
      </Header>

      <main>
        {tab === 'skill' && (
          <>
            <Grid>
              {equippedSkills.map((skill) => (
                <ItemBox
                  key={skill.id}
                  imageURL={skill.imageURL}
                  equipped
                  onUnequip={() => handleUnequip(skill.id, 'skill')}
                />
              ))}
            </Grid>
            <Divider />
            <Grid>
              {unequippedSkills.map((skill) => (
                <ItemBox
                  key={skill.id}
                  imageURL={skill.imageURL}
                />
              ))}
            </Grid>
          </>
        )}
        {tab === 'item' && (
          <>
            <Grid>
              {equippedItems.map((item) => (
                <ItemBox
                  key={item.id}
                  imageURL={item.imageURL}
                  equipped
                  onUnequip={() => handleUnequip(item.id, 'item')}
                />
              ))}
            </Grid>
            <Divider />
            <Grid>
              {unequippedItems.map((item) => (
                <ItemBox
                  key={item.id}
                  imageURL={item.imageURL}
                />
              ))}
            </Grid>
          </>
        )}
      </main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  text-align: center;
`;

const Title = styled.div`
  ${({ theme }) => theme.textStyles.B_R_20};
  padding: 12px;
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
