import * as ACTIONS from "../../store/actions/pokemonAction";
import {
  initialState,
  Pokemon,
  PokemonGender,
  PokemonState,
  PokemonType,
  reducer,
} from "./reducer"; // Adjust path as needed

// Mock data for testing
const mockPokemon: Pokemon[] = [
  { id: 1, name: "bulbasaur", url: "/pokemon/1" },
  { id: 2, name: "ivysaur", url: "/pokemon/2" },
];

const mockTypes: PokemonType[] = [
  { id: 1, name: "grass" },
  { id: 2, name: "poison" },
];

const mockGenders: PokemonGender[] = [{ name: "male" }, { name: "female" }];

describe("Pokemon Reducer", () => {
  let state: PokemonState;

  beforeEach(() => {
    state = { ...initialState };
  });

  test("should return initial state", () => {
    const result = reducer(undefined, { type: "unknown" });
    expect(result).toEqual(initialState);
  });

  test(`should handle ${ACTIONS.SET_POKEMON_LIST}`, () => {
    const action = {
      type: ACTIONS.SET_POKEMON_LIST,
      payload: mockPokemon,
    };

    const result = reducer(state, action);

    expect(result.pokemonsList).toEqual([
      ...initialState.pokemonsList,
      ...mockPokemon,
    ]);
    expect(result).not.toBe(state); // Immutability: new object
  });

  test(`should handle ${ACTIONS.SET_ALL_POKEMON_LIST}`, () => {
    const action = {
      type: ACTIONS.SET_ALL_POKEMON_LIST,
      payload: mockPokemon,
    };

    const result = reducer(state, action);

    expect(result.allPokemonsList).toEqual(mockPokemon);
    expect(result).not.toBe(state);
  });

  test(`should handle ${ACTIONS.SET_FILTERED_POKEMON_LIST}`, () => {
    const action = {
      type: ACTIONS.SET_FILTERED_POKEMON_LIST,
      payload: mockPokemon,
    };

    const result = reducer(state, action);

    expect(result.pokemonsList).toEqual(mockPokemon);
    expect(result).not.toBe(state);
  });

  test(`should handle ${ACTIONS.SET_POKEMON_TYPE}`, () => {
    const action = {
      type: ACTIONS.SET_POKEMON_TYPE,
      payload: mockTypes,
    };

    const result = reducer(state, action);

    expect(result.pokemonsTypes).toEqual(mockTypes);
    expect(result).not.toBe(state);
  });

  test(`should handle ${ACTIONS.SET_POKEMON_GENDER_LIST}`, () => {
    const action = {
      type: ACTIONS.SET_POKEMON_GENDER_LIST,
      payload: mockGenders,
    };

    const result = reducer(state, action);

    expect(result.pokemonGenderList).toEqual(mockGenders);
    expect(result).not.toBe(state);
  });

  test(`should handle ${ACTIONS.SET_API_CALL_INPROGRESS}`, () => {
    const action = {
      type: ACTIONS.SET_API_CALL_INPROGRESS,
      payload: true,
    };

    const result = reducer(state, action);

    expect(result.isLoading).toBe(true);
    expect(result).not.toBe(state);

    // Test false
    const nextAction = { ...action, payload: false };
    const finalState = reducer(result, nextAction);
    expect(finalState.isLoading).toBe(false);
  });

  test(`should handle ${ACTIONS.SET_LOAD_MORE_API_CALL_INPROGRESS}`, () => {
    const action = {
      type: ACTIONS.SET_LOAD_MORE_API_CALL_INPROGRESS,
      payload: true,
    };

    const result = reducer(state, action);

    expect(result.isLoadMoreInprogress).toBe(true);
    expect(result).not.toBe(state);

    const nextAction = { ...action, payload: false };
    const finalState = reducer(result, nextAction);
    expect(finalState.isLoadMoreInprogress).toBe(false);
  });

  test(`should handle ${ACTIONS.SET_POKEMON_BY_ID}`, () => {
    const action = {
      type: ACTIONS.SET_POKEMON_BY_ID,
      payload: mockPokemon[0],
    };

    const result = reducer(state, action);

    expect(result.pokemonData).toEqual(mockPokemon[0]);
    expect(result).not.toBe(state);
  });

  test(`should handle ${ACTIONS.RESET_POKEMON_DATA}`, () => {
    // Start with some data
    state = { ...state, pokemonData: mockPokemon[0] };

    const action = { type: ACTIONS.RESET_POKEMON_DATA };
    const result = reducer(state, action);

    expect(result.pokemonData).toBeNull();
    expect(result).not.toBe(state);
  });

  test(`should handle ${ACTIONS.SET_POKEMON_ID}`, () => {
    const action = {
      type: ACTIONS.SET_POKEMON_ID,
      payload: 25,
    };

    const result = reducer(state, action);

    expect(result.pokemonSelectedId).toBe(25);
    expect(result).not.toBe(state);

    // Test null
    const nextAction = { ...action, payload: null };
    const finalState = reducer(result, nextAction);
    expect(finalState.pokemonSelectedId).toBeNull();
  });

  test("should return state for unknown action", () => {
    const unknownAction = { type: "UNKNOWN_ACTION", payload: "test" };
    const result = reducer(state, unknownAction);

    expect(result).toEqual(state);
    expect(result).toBe(state); // Should return same reference
  });
});
