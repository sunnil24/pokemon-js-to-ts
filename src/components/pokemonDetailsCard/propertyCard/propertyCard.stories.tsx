// src/components/PropertyCard.stories.tsx

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import PropertyCard from "./propertyCard";

// Mock species data
const mockSpeciesData = {
  egg_groups: [{ name: "monster" }, { name: "dragon" }],
};

// Mock Pokémon data
const mockPokemonData = {
  height: 7,
  weight: 69,
  abilities: [
    { ability: { name: "overgrow" } },
    { ability: { name: "chlorophyll" } },
  ],
  types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
};

// Mock Pokémon type damage relations data
const mockPokemonTypeData = {
  damage_relations: {
    double_damage_from: [
      { name: "fire" },
      { name: "ice" },
      { name: "flying" },
      { name: "psychic" },
    ],
  },
};

const meta: Meta<typeof PropertyCard> = {
  title: "Components/PropertyCard",
  component: PropertyCard,
};

export default meta;

type Story = StoryObj<typeof PropertyCard>;

export const Default: Story = {
  args: {
    speciesData: mockSpeciesData,
    data: mockPokemonData,
    pokemonTypeData: mockPokemonTypeData,
  },
};
