import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '../components/common/TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: '이메일',
    placeholder: '이메일을 입력하세요',
    variant: 'primary',
  },
  argTypes: {
    variant: {
      options: [undefined, 'primary', 'secondary'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: true,
    placeholder: '잘못된 입력입니다.',
  },
};

export const SecondaryVariant: Story = {
  args: {
    variant: 'secondary',
    label: '비밀번호',
    placeholder: '비밀번호를 입력하세요',
  },
};

export const NoVariant: Story = {
  args: {
    variant: undefined,
    label: '닉네임',
    placeholder: '닉네임을 입력하세요',
  },
};
