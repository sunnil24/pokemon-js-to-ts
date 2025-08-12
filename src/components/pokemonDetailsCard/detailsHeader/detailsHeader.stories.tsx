// src/components/DetailsHeader.stories.tsx

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import DetailsHeader from "./detailsHeader";

// Mocked Pokemon data (simplified)
const mockPokemon = {
  id: 25,
  name: "pikachu",
  sprites: {
    front_default:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    other: {
      dream_world: { front_default: undefined },
      "official-artwork": { front_default: undefined },
    },
  },
  types: [{ type: { name: "electric" } }],
};

// Mocked species data with flavor text entries
const mockSpeciesData = {
  flavor_text_entries: [
    {
      flavor_text:
        "When several of these Pokémon gather, their electricity could build and cause lightning storms.",
      language: { name: "en" },
    },
    {
      flavor_text:
        "Si plusieurs de ces Pokémon se rassemblent, leur électricité pourrait déclencher des orages.",
      language: { name: "fr" },
    },
  ],
};

const meta: Meta<typeof DetailsHeader> = {
  title: "Components/DetailsHeader",
  component: DetailsHeader,
  argTypes: {
    backClick: { action: "back clicked" },
    closeClick: { action: "close clicked" },
    forwordClick: { action: "forward clicked" },
  },
};

export default meta;

type Story = StoryObj<typeof DetailsHeader>;

export const Default: Story = {
  args: {
    data: mockPokemon,
    speciesData: mockSpeciesData,
  },
};
