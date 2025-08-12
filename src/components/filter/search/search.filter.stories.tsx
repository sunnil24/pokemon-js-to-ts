// src/components/SearchFilter.stories.tsx

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import SearchFilter from "./search.filter";

const meta: Meta<typeof SearchFilter> = {
  title: "Components/Filter/SearchFilter",
  component: SearchFilter,
  argTypes: {
    onChangeHandler: { action: "changed" },
  },
};

export default meta;

type Story = StoryObj<typeof SearchFilter>;

export const Default: Story = {
  args: {
    label: "Search Pokémon",
    placeholder: "Type to search...",
    inputClass: "",
  },
};
