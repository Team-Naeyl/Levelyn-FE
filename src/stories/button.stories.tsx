import type {Meta, StoryObj} from '@storybook/react-vite';
import {fn} from "storybook/test";
import {Button} from "../components/common/Button";
import { Icon } from '@iconify/react';
import addIcon from '@iconify-icons/material-symbols/add';

const meta = {
    title: "Example/Button",
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['contained', 'outlined', 'texted'],
            description: '버튼의 스타일 변형',
        },
        size: {
            control: 'select',
            options: ['small', 'medium'],
            description: '버튼의 크기',
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
        },
        loading: {
            control: 'boolean',
            description: '로딩 상태',
        },
        fullWidth: {
            control: 'boolean',
            description: '전체 너비 사용 여부',
        },
        color: {
            control: 'select',
            options: ['primary', 'secondary', 'error', 'ghost'],
            description: '버튼의 색상',
        },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Text Only Buttons
export const Primary: Story = {
    args: {
        label: 'Button',
        variant: 'contained',
        size: 'medium',
        color: 'primary',
        onClick: fn(),
    },
};

export const Secondary: Story = {
    args: {
        label: 'Button',
        variant: 'outlined',
        size: 'medium',
        color: 'secondary',
        onClick: fn(),
    },
};

export const Error: Story = {
    args: {
        label: 'Button',
        variant: 'texted',
        size: 'medium',
        color: 'error',
        onClick: fn(),
    },
};

export const Ghost: Story = {
    args: {
        label: 'Button',
        variant: 'contained',
        size: 'medium',
        color: 'ghost',
        onClick: fn(),
    },
};

// Text + Icon Buttons
export const PrimaryWithIcon: Story = {
    args: {
        label: 'Button',
        variant: 'contained',
        size: 'medium',
        color: 'primary',
        icon: <Icon icon={addIcon} />,
        onClick: fn(),
    },
};

export const SecondaryWithIcon: Story = {
    args: {
        label: 'Button',
        variant: 'contained',
        size: 'medium',
        color: 'secondary',
        icon: <Icon icon={addIcon} />,
        onClick: fn(),
    },
};

export const ErrorWithIcon: Story = {
    args: {
        label: 'Button',
        variant: 'contained',
        size: 'medium',
        color: 'error',
        icon: <Icon icon={addIcon} />,
        onClick: fn(),
    },
};

export const GhostWithIcon: Story = {
    args: {
        label: 'Button',
        variant: 'contained',
        size: 'medium',
        color: 'ghost',
        icon: <Icon icon={addIcon} />,
        onClick: fn(),
    },
};

// Icon Only Buttons
export const PrimaryIconOnly: Story = {
    args: {
        variant: 'contained',
        size: 'medium',
        color: 'primary',
        icon: <Icon icon={addIcon} />,
        onClick: fn(),
    },
};

export const SecondaryIconOnly: Story = {
    args: {
        variant: 'contained',
        size: 'medium',
        color: 'secondary',
        icon: <Icon icon={addIcon} />,
        onClick: fn(),
    },
};

export const ErrorIconOnly: Story = {
    args: {
        variant: 'contained',
        size: 'medium',
        color: 'error',
        icon: <Icon icon={addIcon} />,
        onClick: fn(),
    },
};

export const GhostIconOnly: Story = {
    args: {
        variant: 'contained',
        size: 'medium',
        color: 'ghost',
        icon: <Icon icon={addIcon} />,
        onClick: fn(),
    },
};

// States
export const Disabled: Story = {
    args: {
        label: 'Button',
        variant: 'contained',
        size: 'medium',
        color: 'primary',
        disabled: true,
        onClick: fn(),
    },
};

export const Loading: Story = {
    args: {
        label: 'Button',
        variant: 'contained',
        size: 'medium',
        color: 'primary',
        loading: true,
        onClick: fn(),
    },
};

export const FullWidth: Story = {
    args: {
        label: 'Button',
        variant: 'contained',
        size: 'medium',
        color: 'primary',
        fullWidth: true,
        onClick: fn(),
    },
};
