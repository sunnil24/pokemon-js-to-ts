import { createContext } from "react";

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default?: string;
    other: {
      dream_world?: {
        front_default?: string;
      };
      "official-artwork"?: {
        front_default?: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats?: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

export interface PokemonType {
  name: string;
  url: string;
}

export interface PokemonGender {
  name: string;
  url: string;
}

export interface PokemonContextState {
  pokemons: Pokemon[];
  allPokemonsList: Pokemon[];
  offset: number;
  isLoading: boolean;
  selectedPokemonData: Pokemon | null;
  isCardSelected: boolean;
  pokemonTypes: PokemonType[];
  pokemonGenders: PokemonGender[];
}

export interface PokemonContextType {
  state: PokemonContextState;
  dispatch: React.Dispatch<any>;
  getPokemonData: (loadMore?: boolean) => void;
  setPokemonList: (pokemons: Pokemon[]) => void;
  setOffset: (offset: number) => void;
  setIsLoading: (loading: boolean) => void;
  setSelectedPokemonData: (pokemon: Pokemon | null) => void;
  setIsCardSelected: (selected: boolean) => void;
  setPokemonTypes: (types: PokemonType[]) => void;
  setPokemonGenders: (genders: PokemonGender[]) => void;
  setAppLoading?: (loading: boolean) => void;
  getPokemonDetailsListByUrl?: (urls: string[]) => Promise<Pokemon[]>;
}

export const initialState: PokemonContextType = {
  state: {
    pokemons: [],
    allPokemonsList: [],
    offset: 0,
    isLoading: true,
    selectedPokemonData: null,
    isCardSelected: false,
    pokemonTypes: [],
    pokemonGenders: [],
  },
  dispatch: () => {},
  getPokemonData: () => {},
  setPokemonList: () => {},
  setOffset: () => {},
  setIsLoading: () => {},
  setSelectedPokemonData: () => {},
  setIsCardSelected: () => {},
  setPokemonTypes: () => {},
  setPokemonGenders: () => {},
  setAppLoading: () => {},
  getPokemonDetailsListByUrl: async () => [],
};

const PokemonContext = createContext<PokemonContextType | any>(initialState);

export default PokemonContext;
