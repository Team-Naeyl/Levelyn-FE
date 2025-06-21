import type { Meta, StoryObj } from '@storybook/react';
import { TodoItem } from '../components/common/TodoItem';

const meta: Meta<typeof TodoItem> = {
  title: 'Components/TodoItem',
  component: TodoItem,
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: '할일 아이템의 고유 ID',
    },
    text: {
      control: 'text',
      description: '할일 내용',
    },
    checked: {
      control: 'boolean',
      description: '완료 상태',
    },
    category: {
      control: 'select',
      options: ['공부', '운동', '업무', '생활', '기타'],
      description: '할일 카테고리',
    },
    onCheck: {
      action: 'checked',
      description: '체크 상태 변경 시 호출되는 함수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TodoItem>;

export const Study: Story = {
  args: {
    id: '1',
    text: 'React 공부하기',
    checked: false,
    category: '공부',
  },
};

export const Exercise: Story = {
  args: {
    id: '2',
    text: '헬스장 가기',
    checked: false,
    category: '운동',
  },
};

export const Work: Story = {
  args: {
    id: '3',
    text: '회의 준비하기',
    checked: false,
    category: '업무',
  },
};

export const Life: Story = {
  args: {
    id: '4',
    text: '장보기',
    checked: false,
    category: '생활',
  },
};

export const Etc: Story = {
  args: {
    id: '5',
    text: '기타 할일',
    checked: false,
    category: '기타',
  },
};

export const Completed: Story = {
  args: {
    id: '6',
    text: '완료된 할일',
    checked: true,
    category: '공부',
  },
};

export const LongText: Story = {
  args: {
    id: '7',
    text: '매우 긴 텍스트를 포함한 할일 아이템입니다. 이 텍스트가 어떻게 표시되는지 확인해보세요.',
    checked: false,
    category: '업무',
  },
};
