// src/components/AppFilter.stories.tsx

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { useReducer } from "react";
import PokemonContext from "../../context/pokemonContext/pokmon.context";
import AppFilter from "./filter";

// Mock data for types and genders
const mockTypes = [
  { label: "Electric", value: "electric-url" },
  { label: "Water", value: "water-url" },
];

const mockGenders = [
  { label: "Male", value: "male-url" },
  { label: "Female", value: "female-url" },
];

// Initial mock state
const initialState = {
  allPokemonsList: [], // Could add sample pokemons if needed
  pokemonsTypes: mockTypes,
  pokemonGenderList: mockGenders,
};

// Mock reducer (just returns state here)
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_POKEMON_TYPE":
      return { ...state, pokemonsTypes: action.payload };
    case "SET_POKEMON_GENDER_LIST":
      return { ...state, pokemonGenderList: action.payload };
    default:
      return state;
  }
};

const PokemonProviderMock = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Mock functions used in context
  const getPokemonData = () => Promise.resolve();
  const setAppLoading = () => {};
  const getPokemonDetailsListByUrl = () => Promise.resolve([]);

  return (
    <PokemonContext.Provider
      value={{
        state,
        dispatch,
        getPokemonData,
        setAppLoading,
        getPokemonDetailsListByUrl,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

const meta: Meta<typeof AppFilter> = {
  title: "Components/Filter",
  component: AppFilter,
  decorators: [
    (Story) => (
      <PokemonProviderMock>
        <Story />
      </PokemonProviderMock>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AppFilter>;

export const Default: Story = {
  args: {
    isFilterEnable: (enabled) => console.log("Filter enabled:", enabled),
  },
};
