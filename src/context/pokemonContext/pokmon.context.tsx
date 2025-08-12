import { createContext } from "react";
import { initialState } from "../../store/reducers/reducer";

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

export interface PokemonContextType {
  state: {
    pokemons: Pokemon[];
    allPokemonsList: Pokemon[];
    offset: number;
    isLoading: boolean;
    selectedPokemonData: Pokemon | null;
    isCardSelected: boolean;
    pokemonTypes: PokemonType[];
    pokemonGenders: PokemonGender[];
  };
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

const PokemonContext = createContext<PokemonContextType | any>({
  state: initialState,
  dispatch: () => null,
  getPokemonData: () => {},
  setPokemonList: () => {},
  setOffset: () => {},
  setIsLoading: () => {},
  setSelectedPokemonData: () => {},
  setIsCardSelected: () => {},
  setPokemonTypes: () => {},
  setPokemonGenders: () => {},
});

export default PokemonContext;
