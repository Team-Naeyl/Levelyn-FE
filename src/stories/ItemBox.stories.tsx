import type { Meta, StoryObj } from '@storybook/react-vite';
import ItemBox from '../components/common/ItemBox';
import styled from '@emotion/styled';

const meta: Meta<typeof ItemBox> = {
  title: 'Components/ItemBox',
  component: ItemBox,
  tags: ['autodocs'],
  args: {
    imageURL: 'https://picsum.photos/seed/default/24',
    size: 'fullwidth',
  },
  argTypes: {
    size: {
      options: ['fullwidth', 'mini'],
      control: { type: 'radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ItemBox>;

export const Default: Story = {};

export const Mini: Story = {
  args: {
    size: 'mini',
  },
};

export const EquippedWithUnequip: Story = {
  args: {
    equipped: true,
    onUnequip: () => alert('아이템 해제됨'),
  },
};

export const InGrid: Story = {
  render: () => (
    <GridWrapper>
      {Array.from({ length: 9 }, (_, i) => (
        <ItemBox
          key={i + 1}
          imageURL={`https://picsum.photos/seed/item${i}/64`}
          equipped={i % 3 === 0}
          onUnequip={() => alert(`item${i} 해제됨`)}
        />
      ))}
    </GridWrapper>
  ),
};

const GridWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 12px;
`;
