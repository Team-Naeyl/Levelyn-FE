import type {Meta, StoryObj} from '@storybook/react-vite';
import {fn} from "storybook/test";
import {Button} from "../components/common/Button";
import { Icon } from '@iconify/react';
import addIcon from '@iconify-icons/material-symbols/add';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../styles/theme';

const meta = {
    title: "Example/Button",
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme}>
                <Story />
            </ThemeProvider>
        ),
    ],
    argTypes: {
        variant: {
            control: 'select',
            options: ['contained', 'outlined', 'texted'],
        },
        size: {
            control: 'select',
            options: ['small', 'medium'],
        },
        disabled: {
            control: 'boolean',
        },
        loading: {
            control: 'boolean',
        },
        fullWidth: {
            control: 'boolean',
        },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Text Only
export const ContainedText: Story = {
    args: {
        label: 'Button',
        variant: 'contained',
        size: 'medium',
        onClick: fn(),
    },
};

export const OutlinedText: Story = {
    args: {
        label: 'Button',
        variant: 'outlined',
        size: 'medium',
        onClick: fn(),
    },
};

export const TextedText: Story = {
    args: {
        label: 'Button',
        variant: 'texted',
        size: 'medium',
        onClick: fn(),
    },
};

// Text + Icon
export const ContainedTextWithIcon: Story = {
    args: {
        label: 'Button',
        variant: 'contained',
        size: 'medium',
        icon: <Icon icon={addIcon} />,
        onClick: fn(),
    },
};

export const OutlinedTextWithIcon: Story = {
    args: {
        label: 'Button',
        variant: 'outlined',
        size: 'medium',
        icon: <Icon icon={addIcon} />,
        onClick: fn(),
    },
};

export const TextedTextWithIcon: Story = {
    args: {
        label: 'Button',
        variant: 'texted',
        size: 'medium',
        icon: <Icon icon={addIcon} />,
        onClick: fn(),
    },
};

// Icon Only
export const ContainedIconOnly: Story = {
    args: {
        variant: 'contained',
        size: 'medium',
        icon: <Icon icon={addIcon} />,
        onClick: fn(),
    },
};

export const OutlinedIconOnly: Story = {
    args: {
        variant: 'outlined',
        size: 'medium',
        icon: <Icon icon={addIcon} />,
        onClick: fn(),
    },
};

export const TextedIconOnly: Story = {
    args: {
        variant: 'texted',
        size: 'medium',
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
        disabled: true,
        onClick: fn(),
    },
};

export const Loading: Story = {
    args: {
        label: 'Button',
        variant: 'contained',
        size: 'medium',
        loading: true,
        onClick: fn(),
    },
};

export const FullWidth: Story = {
    args: {
        label: 'Button',
        variant: 'contained',
        size: 'medium',
        fullWidth: true,
        onClick: fn(),
    },
};
