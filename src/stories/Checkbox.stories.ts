import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from '../components/common/CheckBox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '체크박스의 체크 상태',
    },
    disabled: {
      control: 'boolean',
      description: '체크박스의 비활성화 상태',
    },
    onChange: {
      action: 'changed',
      description: '체크 상태 변경 시 호출되는 함수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};
