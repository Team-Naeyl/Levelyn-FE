import type { Meta, StoryObj } from '@storybook/react';
import { BottomNavigation } from '../components/layout/BottomNavigation/_components/BottomNavigation';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof BottomNavigation> = {
  title: 'Layout/BottomNavigation',
  component: BottomNavigation,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BottomNavigation>;

export const Default: Story = {};
