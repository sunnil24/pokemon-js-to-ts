// src/components/AppMultiSelectDropDown.stories.tsx

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import AppMultiSelectDropDown from "./multiSelectdropDown";

const sampleData = [
  { label: "Option 1", value: 1 },
  { label: "Option 2", value: 2 },
  { label: "Option 3", value: 3 },
  { label: "Option 4", value: 4 },
];

const meta: Meta<typeof AppMultiSelectDropDown> = {
  title: "Components/AppMultiSelectDropDown",
  component: AppMultiSelectDropDown,
};

export default meta;

type Story = StoryObj<typeof AppMultiSelectDropDown>;

export const Default: Story = {
  args: {
    label: "Select Options",
    data: sampleData,
    placeholder: "Choose options...",
    onChangeHandler: (value) => {
      // You can log or handle the selected values here
      console.log("Selected values:", value);
    },
    onOpenHandler: () => {
      console.log("Dropdown opened");
    },
    onCloseHandler: () => {
      console.log("Dropdown closed");
    },
    onCleanHandler: () => {
      console.log("Dropdown cleared");
    },
    isOpen: false,
  },
};
