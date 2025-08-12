// src/components/ColorfulTag.stories.tsx

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import ColorfulTag from "./colorfulTag";

const meta: Meta<typeof ColorfulTag> = {
  title: "Components/ColorfulTag",
  component: ColorfulTag,
  argTypes: {
    text: { control: "text" },
    className: { control: "text" },
    type: {
      control: "select",
      options: ["fire", "water", "grass", "electric", "psychic", "normal"], // example Pokémon types
    },
  },
};

export default meta;

type Story = StoryObj<typeof ColorfulTag>;

export const Default: Story = {
  args: {
    text: "Fire",
    className: "",
    type: "fire",
  },
};
