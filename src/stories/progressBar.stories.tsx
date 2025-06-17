import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from '../components/common/ProgressBar';

const meta: Meta<typeof ProgressBar> = {
    title: 'Components/ProgressBar',
    component: ProgressBar,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['exp', 'timer'],
            description: 'ProgressBar의 종류 (exp: 경험치, timer: 타이머)',
        },
        label: {
            control: 'text',
            description: 'ProgressBar의 라벨',
        },
        total: {
            control: 'number',
            description: 'ProgressBar의 총량',
        },
        current: {
            control: 'number',
            description: 'ProgressBar의 현재 진행도',
        },
        width: {
            control: 'number',
            description: 'ProgressBar의 너비 (px)',
        },
        height: {
            control: 'number',
            description: 'ProgressBar의 높이 (px)',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Experience: Story = {
    args: {
        variant: 'exp',
        label: '경험치',
        total: 100,
        current: 75,
        width: 300,
        height: 20,
    },
};

export const Timer: Story = {
    args: {
        variant: 'timer',
        label: '시간',
        total: 60,
        current: 30,
        width: 300,
        height: 20,
    },
};

export const Empty: Story = {
    args: {
        variant: 'exp',
        label: '경험치',
        total: 100,
        current: 0,
        width: 300,
        height: 20,
    },
};

export const Full: Story = {
    args: {
        variant: 'exp',
        label: '경험치',
        total: 100,
        current: 100,
        width: 300,
        height: 20,
    },
};

export const CustomSize: Story = {
    args: {
        variant: 'exp',
        label: '경험치',
        total: 100,
        current: 50,
        width: 400,
        height: 30,
    },
};