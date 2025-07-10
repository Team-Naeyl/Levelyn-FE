import type { Meta, StoryObj } from '@storybook/react-vite';
import ItemModal from '../pages/Inventory/.components/ItemModal';
import { useState } from 'react';

const meta: Meta<typeof ItemModal> = {
  title: 'Components/ItemModal',
  component: ItemModal,
  tags: ['autodocs'],
  args: {
    item: {
      id: 1,
      name: '마법의 검',
      description: '전설의 검입니다.\n공격력이 매우 높습니다.',
      imageURL: 'https://picsum.photos/seed/item1/64',
      equipped: false,
    },
    open: true,
  },
  argTypes: {
    open: { control: 'boolean' },
  },
};

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

export default meta;
type Story = StoryObj<typeof ItemModal>;

export const Default: Story = {
  args: {},
  render: (args) => <ItemModalExample {...args} />,
};

export const EquippedItem: Story = {
  args: {
    item: {
      id: 2,
      name: '방어의 방패',
      description: '단단한 방패입니다.\n방어력이 높습니다.',
      imageURL: 'https://picsum.photos/seed/item2/64',
      equipped: true,
    },
  },
  render: (args) => <ItemModalExample {...args} />,
};

const ItemModalExample = (args: ItemModalProps) => {
  const [open, setOpen] = useState(args.open);
  const [equipped, setEquipped] = useState(args.item.equipped);

  const handleClose = () => setOpen(false);
  const handleToggleEquip = () => setEquipped((prev: boolean) => !prev);

  return (
    <ItemModal
      {...args}
      open={open}
      item={{ ...args.item, equipped }}
      onClose={handleClose}
      onToggleEquip={handleToggleEquip}
    />
  );
};
