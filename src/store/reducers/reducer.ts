import * as ACTIONS from "../../store/actions/pokemonAction";
// types/pokemon.ts (optional: move to a shared types file)
export interface Pokemon {
  id: number;
  name: string;
  url?: string;
  // Add other fields as needed
}

export interface PokemonType {
  id: number;
  name: string;
}

export interface PokemonGender {
  name: string;
  // Add relevant fields
}

// Define action types as constants (inline for clarity, but can be imported)
const SET_POKEMON_LIST = ACTIONS.SET_POKEMON_LIST;
const SET_ALL_POKEMON_LIST = ACTIONS.SET_ALL_POKEMON_LIST;
const SET_FILTERED_POKEMON_LIST = ACTIONS.SET_FILTERED_POKEMON_LIST;
const SET_POKEMON_TYPE = ACTIONS.SET_POKEMON_TYPE;
const SET_POKEMON_GENDER_LIST = ACTIONS.SET_POKEMON_GENDER_LIST;
const SET_API_CALL_INPROGRESS = ACTIONS.SET_API_CALL_INPROGRESS;
const SET_LOAD_MORE_API_CALL_INPROGRESS =
  ACTIONS.SET_LOAD_MORE_API_CALL_INPROGRESS;
const SET_POKEMON_BY_ID = ACTIONS.SET_POKEMON_BY_ID;
const RESET_POKEMON_DATA = ACTIONS.RESET_POKEMON_DATA;
const SET_POKEMON_ID = ACTIONS.SET_POKEMON_ID;

// Define action payloads
type PokemonListPayload = {
  payload: Pokemon[];
};

type AllPokemonListPayload = {
  payload: Pokemon[];
};

type FilteredPokemonListPayload = {
  payload: Pokemon[];
};

type PokemonTypePayload = {
  payload: PokemonType[];
};

type PokemonGenderListPayload = {
  payload: PokemonGender[];
};

type LoadingPayload = {
  payload: boolean;
};

type PokemonDataPayload = {
  payload: Pokemon | null;
};

type PokemonIdPayload = {
  payload: number | null;
};

// Define action union types
type PokemonAction =
  | ({ type: typeof SET_POKEMON_LIST } & PokemonListPayload)
  | ({ type: typeof SET_ALL_POKEMON_LIST } & AllPokemonListPayload)
  | ({ type: typeof SET_FILTERED_POKEMON_LIST } & FilteredPokemonListPayload)
  | ({ type: typeof SET_POKEMON_TYPE } & PokemonTypePayload)
  | ({ type: typeof SET_POKEMON_GENDER_LIST } & PokemonGenderListPayload)
  | ({ type: typeof SET_API_CALL_INPROGRESS } & LoadingPayload)
  | ({ type: typeof SET_LOAD_MORE_API_CALL_INPROGRESS } & LoadingPayload)
  | ({ type: typeof SET_POKEMON_BY_ID } & PokemonDataPayload)
  | { type: typeof RESET_POKEMON_DATA }
  | ({ type: typeof SET_POKEMON_ID } & PokemonIdPayload);

// Define State interface
export interface PokemonState {
  pokemonsList: Pokemon[];
  allPokemonsList: Pokemon[];
  pokemonSelectedId: number | null;
  pokemonData: Pokemon | null;
  isLoading: boolean;
  isLoadMoreInprogress: boolean;
  pokemonsTypes: PokemonType[];
  pokemonGenderList: PokemonGender[];
}

// Initial State
export const initialState: PokemonState = {
  pokemonsList: [],
  allPokemonsList: [],
  pokemonSelectedId: null,
  pokemonData: null,
  isLoading: true,
  isLoadMoreInprogress: false,
  pokemonsTypes: [],
  pokemonGenderList: [],
};

// Reducer
export const reducer = (
  state: PokemonState,
  action: PokemonAction
): PokemonState => {
  console.log(action, "action in reducer");

  switch (action.type) {
    case SET_POKEMON_LIST:
      return {
        ...state,
        pokemonsList: [...state.pokemonsList, ...action.payload],
      };

    case SET_ALL_POKEMON_LIST:
      return {
        ...state,
        allPokemonsList: action.payload,
      };

    case SET_FILTERED_POKEMON_LIST:
      return {
        ...state,
        pokemonsList: action.payload,
      };

    case SET_POKEMON_TYPE:
      return {
        ...state,
        pokemonsTypes: action.payload,
      };

    case SET_POKEMON_GENDER_LIST:
      return {
        ...state,
        pokemonGenderList: action.payload,
      };

    case SET_API_CALL_INPROGRESS:
      return {
        ...state,
        isLoading: action.payload,
      };

    case SET_LOAD_MORE_API_CALL_INPROGRESS:
      return {
        ...state,
        isLoadMoreInprogress: action.payload,
      };

    case SET_POKEMON_BY_ID:
      return {
        ...state,
        pokemonData: action.payload,
      };

    case RESET_POKEMON_DATA:
      return {
        ...state,
        pokemonData: null,
      };

    case SET_POKEMON_ID:
      return {
        ...state,
        pokemonSelectedId: action.payload,
      };

    default:
      return state;
  }
};
