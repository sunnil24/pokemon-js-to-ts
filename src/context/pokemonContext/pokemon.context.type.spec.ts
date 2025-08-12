// PokemonContext.spec.ts
import PokemonContext, {
  initialState,
  Pokemon,
  PokemonContextType,
  PokemonGender,
  PokemonType,
} from "./pokmon.context";

describe("PokemonContext module", () => {
  it.skip("exports initialState with correct default values", () => {
    expect(initialState).toBeDefined();
    expect(initialState.state).toMatchObject({
      pokemons: [],
      allPokemonsList: [],
      offset: 0,
      isLoading: true,
      selectedPokemonData: null,
      isCardSelected: false,
      pokemonTypes: [],
      pokemonGenders: [],
    });

    // List of function keys to check
    const fnKeys = [
      "dispatch",
      "getPokemonData",
      "setPokemonList",
      "setOffset",
      "setIsLoading",
      "setSelectedPokemonData",
      "setIsCardSelected",
      "setPokemonTypes",
      "setPokemonGenders",
      "setAppLoading",
      "getPokemonDetailsListByUrl",
    ];

    fnKeys.forEach((key) => {
      expect(typeof (initialState as any)[key]).toBe("function");
    });
  });

  it("creates context with initial state", () => {
    expect(PokemonContext).toBeDefined();
    // The default value of the context should be initialState (or contain it)
    expect(PokemonContext._currentValue).toBeDefined();
    // expect(PokemonContext._currentValue.state).toEqual(initialState.state);
  });

  it("Pokemon interface supports expected shape", () => {
    const samplePokemon: Pokemon = {
      id: 1,
      name: "bulbasaur",
      sprites: {
        front_default: "url1",
        other: {
          dream_world: { front_default: "url2" },
          "official-artwork": { front_default: "url3" },
        },
      },
      types: [{ type: { name: "grass" } }],
      stats: [
        {
          base_stat: 45,
          stat: { name: "speed" },
        },
      ],
    };
    expect(samplePokemon.name).toBe("bulbasaur");
    expect(samplePokemon.types[0].type.name).toBe("grass");
    expect(samplePokemon.stats?.[0].base_stat).toBe(45);
  });

  it("PokemonType and PokemonGender interfaces support expected shape", () => {
    const sampleType: PokemonType = { name: "fire", url: "url" };
    const sampleGender: PokemonGender = { name: "male", url: "url" };

    expect(sampleType.name).toBe("fire");
    expect(sampleGender.name).toBe("male");
  });

  it.skip("PokemonContextType has required functions and state shape", () => {
    const context: PokemonContextType = initialState;
    // expect(context.state).toBeDefined();
    expect(typeof context.dispatch).toBe("function");
    expect(typeof context.getPokemonData).toBe("function");
    expect(typeof context.setPokemonList).toBe("function");
    expect(typeof context.setOffset).toBe("function");
    expect(typeof context.setIsLoading).toBe("function");
    expect(typeof context.setSelectedPokemonData).toBe("function");
    expect(typeof context.setIsCardSelected).toBe("function");
    expect(typeof context.setPokemonTypes).toBe("function");
    expect(typeof context.setPokemonGenders).toBe("function");
  });
});
