// src/components/Header.stories.tsx

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import Header from "./header";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    children: <h1>Pokémon App Header</h1>,
  },
};
