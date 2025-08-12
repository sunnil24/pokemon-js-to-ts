// src/components/Apploader.stories.tsx

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import Apploader from "./loader";

const meta: Meta<typeof Apploader> = {
  title: "Components/Loader",
  component: Apploader,
  argTypes: {
    className: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Apploader>;

export const Default: Story = {
  args: {
    className: "",
  },
};
