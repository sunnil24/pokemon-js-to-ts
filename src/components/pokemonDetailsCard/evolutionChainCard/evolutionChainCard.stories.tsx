// src/components/EvolutionChainCard.stories.tsx

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import EvolutionChainCard from "./evolutionChainCard";

// Sample Pokemon data to pass as `data` prop
const samplePokemon = {
  id: 1,
  name: "Bulbasaur",
  sprites: {
    front_default:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    other: {
      dream_world: { front_default: undefined },
      "official-artwork": { front_default: undefined },
    },
  },
  types: [{ type: { name: "grass" } }],
};

const meta: Meta<typeof EvolutionChainCard> = {
  title: "Components/EvolutionChainCard",
  component: EvolutionChainCard,
};

export default meta;

type Story = StoryObj<typeof EvolutionChainCard>;

export const Default: Story = {
  args: {
    data: samplePokemon,
  },
};
