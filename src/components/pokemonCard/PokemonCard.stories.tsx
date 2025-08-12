// src/components/PokemonCard.stories.tsx

import type { Meta, StoryObj } from "@storybook/react-webpack5";

import PokemonCard from "./pokemonCard";

const sampleData = {
  id: 25,
  name: "Pikachu",
  sprites: {
    front_default:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    other: {
      dream_world: {
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg",
      },
      "official-artwork": {
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
      },
    },
  },
  types: [
    {
      type: {
        name: "electric",
      },
    },
  ],
};

const meta: Meta<typeof PokemonCard> = {
  title: "Components/PokemonCard",
  component: PokemonCard,
};

export default meta;

type Story = StoryObj<typeof PokemonCard>;

export const Default: Story = {
  args: {
    data: sampleData,
    onClick: () => alert("Pokemon card clicked!"),
    className: "",
  },
};
