// src/components/StatCard.stories.tsx

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import StatCard from "./statCard";

const sampleStats = [
  { stat: { name: "hp" }, base_stat: 45 },
  { stat: { name: "attack" }, base_stat: 49 },
  { stat: { name: "defense" }, base_stat: 49 },
  { stat: { name: "special-attack" }, base_stat: 65 },
  { stat: { name: "special-defense" }, base_stat: 65 },
  { stat: { name: "speed" }, base_stat: 45 },
];

const meta: Meta<typeof StatCard> = {
  title: "Components/StatCard",
  component: StatCard,
};

export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    stats: sampleStats,
  },
};
