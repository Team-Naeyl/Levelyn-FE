import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from '../components/common/Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/DropDown',
  component: Dropdown,
  tags: ['autodocs'],
  args: {
    placeholder: 'Placeholder',
    fullWidth: false,
    loading: false,
    options: [
      { label: 'Option1', value: 1 },
      { label: 'Option2', value: 2 },
      { label: 'Option2', value: 3 },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
