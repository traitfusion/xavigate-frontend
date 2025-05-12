import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary',
    onClick: () => alert('Clicked'),
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

// ✅ THIS is what fixes the style prop error:
export const CustomStyled: Story = {
  render: () => <Button style={{ backgroundColor: '#4ade80' }}>Green Button</Button>,
};
