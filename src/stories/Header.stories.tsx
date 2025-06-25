import type { Meta, StoryObj } from '@storybook/react-vite';
import HeaderLayout from '../components/common/Header';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof HeaderLayout> = {
  title: 'Components/Header',
  component: HeaderLayout,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeaderLayout>;

export const Main: Story = {
  args: {
    isMain: true,
  },
};

export const WithBack: Story = {
  args: {
    isMain: false,
    title: '제목',
    onBack: () => alert('뒤로가기 클릭됨'),
  },
};

export const WithDelete: Story = {
  args: {
    isMain: false,
    title: '제목',
    onDelete: () => alert('삭제 클릭됨'),
  },
};

export const WithBoth: Story = {
  args: {
    isMain: false,
    title: '제목',
    onBack: () => alert('뒤로가기'),
    onDelete: () => alert('삭제'),
  },
};
