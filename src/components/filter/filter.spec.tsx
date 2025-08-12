// AppFilter.spec.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PokemonContext from "../../context/pokemonContext/pokmon.context";
import * as commonService from "../../services/common.service";
import * as ACTIONS from "../../store/actions/pokemonAction";
import AppFilter from "./filter";

// -----------------------------
// Top-level mocks for child components
// -----------------------------
jest.mock("./search/search.filter", () => {
  return ({ placeholder, onChangeHandler }: any) => (
    <input
      data-testid="search-input"
      placeholder={placeholder}
      onChange={(e) =>
        onChangeHandler(e.target.value, { preventDefault: jest.fn() })
      }
    />
  );
});

// An interactive dropdown mock that exposes handlers and isOpen prop
jest.mock("./multiSelectdropDown/multiSelectdropDown", () => {
  return ({
    placeholder,
    label,
    isOpen,
    onOpenHandler,
    onCloseHandler,
    onCleanHandler,
    onChangeHandler,
  }: any) => (
    <div data-testid={`dropdown-${label}`}>
      <div data-testid={`dropdown-${label}-isOpen`}>{String(isOpen)}</div>
      <button data-testid={`open-${label}`} onClick={onOpenHandler}>
        open
      </button>
      <button data-testid={`close-${label}`} onClick={onCloseHandler}>
        close
      </button>
      <button
        data-testid={`change-${label}`}
        onClick={() =>
          onChangeHandler([{ dummy: "value" }], { preventDefault: jest.fn() })
        }
      >
        change
      </button>
      {/* button to simulate passing an empty array (to hit the 'else' branches) */}
      <button
        data-testid={`change-empty-${label}`}
        onClick={() => onChangeHandler([], { preventDefault: jest.fn() })}
      >
        change-empty
      </button>
      <button
        data-testid={`clean-${label}`}
        onClick={() => onCleanHandler(true)}
      >
        clean
      </button>
    </div>
  );
});

// -----------------------------
// Mock service module (we will set specific resolved values in tests)
// -----------------------------
jest.mock("../../services/common.service", () => ({
  getAllParallelCall: jest.fn(),
  getPokemonGenders: jest.fn(),
  getPokemonTypes: jest.fn(),
  removeDuplicateBy: jest.fn((arr) => arr),
}));

// -----------------------------
// Helper to render component with context
// -----------------------------
const makeContext = (overrides: any = {}) => {
  const mockDispatch = jest.fn();
  const mockGetPokemonData = jest.fn();
  const mockSetAppLoading = jest.fn();
  const mockGetPokemonDetailsListByUrl = jest.fn(() => Promise.resolve([]));
  const defaultContext = {
    state: {
      allPokemonsList: [
        { name: "bulbasaur" },
        { name: "ivysaur" },
        { name: "pikachu" },
      ],
      pokemonsTypes: [],
      pokemonGenderList: [],
    },
    getPokemonData: mockGetPokemonData,
    dispatch: mockDispatch,
    setAppLoading: mockSetAppLoading,
    getPokemonDetailsListByUrl: mockGetPokemonDetailsListByUrl,
    ...overrides,
  };

  const utils = render(
    <PokemonContext.Provider value={defaultContext as any}>
      <AppFilter isFilterEnable={jest.fn()} />
    </PokemonContext.Provider>
  );

  return {
    ...utils,
    mockDispatch,
    mockGetPokemonData,
    mockSetAppLoading,
    mockGetPokemonDetailsListByUrl,
  };
};

beforeEach(() => {
  jest.clearAllMocks();
  // default simple resolved values
  (commonService.getPokemonTypes as jest.Mock).mockResolvedValue({
    results: [],
  });
  (commonService.getPokemonGenders as jest.Mock).mockResolvedValue({
    results: [],
  });
  (commonService.getAllParallelCall as jest.Mock).mockResolvedValue([]);
  (commonService.removeDuplicateBy as jest.Mock).mockImplementation(
    (arr) => arr
  );
});

describe("AppFilter - basic UI and mount effects", () => {
  it("renders search input and both dropdowns", () => {
    makeContext();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-Type")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-Gender")).toBeInTheDocument();
  });

  it("calls getPokemonTypes and getPokemonGenders on mount and dispatches type/gender lists", async () => {
    // make getPokemonTypes / getPokemonGenders return values to cause dispatch
    (commonService.getPokemonTypes as jest.Mock).mockResolvedValue({
      results: [{ name: "fire", url: "fire-url" }],
    });
    (commonService.getPokemonGenders as jest.Mock).mockResolvedValue({
      results: [{ name: "male", url: "male-url" }],
    });

    const { mockDispatch } = makeContext();

    // wait for useEffect chains to resolve
    await waitFor(() => {
      expect(commonService.getPokemonTypes).toHaveBeenCalled();
      expect(commonService.getPokemonGenders).toHaveBeenCalled();
    });

    // After resolved, component should have dispatched SET_POKEMON_TYPE and SET_POKEMON_GENDER_LIST
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: ACTIONS.SET_POKEMON_TYPE })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: ACTIONS.SET_POKEMON_GENDER_LIST })
    );
  });
});

describe("AppFilter - handlers and flows", () => {
  it("onSearchChangeHandler with non-empty value sets loading and enables filter", async () => {
    const mockIsFilterEnable = jest.fn();
    // custom render to capture isFilterEnable prop
    const ctx = {
      state: {
        allPokemonsList: [{ name: "pikapi" }],
        pokemonsTypes: [],
        pokemonGenderList: [],
      },
      getPokemonData: jest.fn(),
      dispatch: jest.fn(),
      setAppLoading: jest.fn(),
      getPokemonDetailsListByUrl: jest.fn(() => Promise.resolve(["detail1"])),
    };
    render(
      <PokemonContext.Provider value={ctx as any}>
        <AppFilter isFilterEnable={mockIsFilterEnable} />
      </PokemonContext.Provider>
    );

    // Non-empty change
    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "pika" },
    });

    await waitFor(() => {
      expect(ctx.setAppLoading).toHaveBeenCalledWith(true);
      expect(mockIsFilterEnable).toHaveBeenCalledWith(true);
      // getPokemonDetailsListByUrl should be eventually called (subscribe triggers chain)
      expect(ctx.getPokemonDetailsListByUrl).toHaveBeenCalled();
    });
  });

  it("onSearchChangeHandler with empty value clears filter and calls getPokemonData", async () => {
    const mockIsFilterEnable = jest.fn();
    const ctx = {
      state: {
        allPokemonsList: [{ name: "x" }],
        pokemonsTypes: [],
        pokemonGenderList: [],
      },
      getPokemonData: jest.fn(),
      dispatch: jest.fn(),
      setAppLoading: jest.fn(),
      getPokemonDetailsListByUrl: jest.fn(() => Promise.resolve([])),
    };

    render(
      <PokemonContext.Provider value={ctx as any}>
        <AppFilter isFilterEnable={mockIsFilterEnable} />
      </PokemonContext.Provider>
    );

    // Trigger empty value (trimmed)
    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "   " },
    });

    await waitFor(() => {
      expect(ctx.getPokemonData).toHaveBeenCalledWith(true);
      expect(mockIsFilterEnable).toHaveBeenCalledWith(false);
      // filterPokemonData([]) calls dispatch for SET_FILTERED_POKEMON_LIST
      expect(ctx.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ACTIONS.SET_FILTERED_POKEMON_LIST,
          payload: [],
        })
      );
    });
  });

  it("onTypeChangeHandler with non-empty value calls getAllParallelCall, maps and dispatches filtered list", async () => {
    // prepare getAllParallelCall to return nested structure the component expects
    (commonService.getAllParallelCall as jest.Mock).mockResolvedValue([
      { pokemon: [{ pokemon: { name: "a" } }, { pokemon: { name: "b" } }] },
    ]);

    const ctx = {
      state: { allPokemonsList: [], pokemonsTypes: [], pokemonGenderList: [] },
      getPokemonData: jest.fn(),
      dispatch: jest.fn(),
      setAppLoading: jest.fn(),
      getPokemonDetailsListByUrl: jest.fn(() => Promise.resolve(["detailA"])),
    };

    render(
      <PokemonContext.Provider value={ctx as any}>
        <AppFilter isFilterEnable={jest.fn()} />
      </PokemonContext.Provider>
    );

    // click the change button for Type (non-empty)
    fireEvent.click(screen.getByTestId("change-Type"));

    await waitFor(() => {
      // getAllParallelCall should have been called
      expect(commonService.getAllParallelCall).toHaveBeenCalled();
      // getPokemonDetailsListByUrl should be called with a flattened list of pokemon objects
      expect(ctx.getPokemonDetailsListByUrl).toHaveBeenCalled();
      // dispatch should be called with filtered results when getPokemonDetailsListByUrl resolves
      expect(ctx.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ACTIONS.SET_FILTERED_POKEMON_LIST,
          payload: ["detailA"],
        })
      );
    });
  });

  it("onTypeChangeHandler with empty selection resets data and calls getPokemonData", async () => {
    const ctx = {
      state: { allPokemonsList: [], pokemonsTypes: [], pokemonGenderList: [] },
      getPokemonData: jest.fn(),
      dispatch: jest.fn(),
      setAppLoading: jest.fn(),
      getPokemonDetailsListByUrl: jest.fn(() => Promise.resolve([])),
    };

    render(
      <PokemonContext.Provider value={ctx as any}>
        <AppFilter isFilterEnable={jest.fn()} />
      </PokemonContext.Provider>
    );

    // click the button that simulates empty array selection
    fireEvent.click(screen.getByTestId("change-empty-Type"));

    await waitFor(() => {
      expect(ctx.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ACTIONS.SET_FILTERED_POKEMON_LIST,
          payload: [],
        })
      );
      expect(ctx.getPokemonData).toHaveBeenCalledWith(true);
    });
  });

  it("onGenderChangeHandler with non-empty value builds urls and calls getPokemonDetailsListByUrl", async () => {
    // Simulate getAllParallelCall returning species details
    (commonService.getAllParallelCall as jest.Mock).mockResolvedValue([
      {
        pokemon_species_details: [
          { pokemon_species: { url: "/api/v2/pokemon-species/10/" } },
          { pokemon_species: { url: "/api/v2/pokemon-species/20/" } },
        ],
      },
    ]);

    const ctx = {
      state: { allPokemonsList: [], pokemonsTypes: [], pokemonGenderList: [] },
      getPokemonData: jest.fn(),
      dispatch: jest.fn(),
      setAppLoading: jest.fn(),
      getPokemonDetailsListByUrl: jest.fn(() => Promise.resolve(["detailG"])),
    };

    render(
      <PokemonContext.Provider value={ctx as any}>
        <AppFilter isFilterEnable={jest.fn()} />
      </PokemonContext.Provider>
    );

    // trigger gender change
    fireEvent.click(screen.getByTestId("change-Gender"));

    await waitFor(() => {
      // getAllParallelCall should have been called
      expect(commonService.getAllParallelCall).toHaveBeenCalled();
      // getPokemonDetailsListByUrl should be called with array of objects having 'url' keys
      expect(ctx.getPokemonDetailsListByUrl).toHaveBeenCalled();
      const calledArg = ctx.getPokemonDetailsListByUrl.mock.calls[0][0];
      expect(Array.isArray(calledArg)).toBeTruthy();
      expect(calledArg[0]).toHaveProperty("url");
      // ensure built URL uses baseURL + '/pokemon'
      expect(String(calledArg[0].url)).toContain("/pokemon");
      // dispatch for filtered list after details fetch
      expect(ctx.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ACTIONS.SET_FILTERED_POKEMON_LIST,
          payload: ["detailG"],
        })
      );
    });
  });

  it("onGenderChangeHandler with empty selection resets data and calls getPokemonData", async () => {
    const ctx = {
      state: { allPokemonsList: [], pokemonsTypes: [], pokemonGenderList: [] },
      getPokemonData: jest.fn(),
      dispatch: jest.fn(),
      setAppLoading: jest.fn(),
      getPokemonDetailsListByUrl: jest.fn(() => Promise.resolve([])),
    };

    render(
      <PokemonContext.Provider value={ctx as any}>
        <AppFilter isFilterEnable={jest.fn()} />
      </PokemonContext.Provider>
    );

    // simulate empty selection for gender
    fireEvent.click(screen.getByTestId("change-empty-Gender"));

    await waitFor(() => {
      expect(ctx.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ACTIONS.SET_FILTERED_POKEMON_LIST,
          payload: [],
        })
      );
      expect(ctx.getPokemonData).toHaveBeenCalledWith(true);
    });
  });

  it("open/close handlers toggle isOpen prop provided to dropdowns and clean triggers isFilterEnable(false)", async () => {
    // we need to supply isFilterEnable to Assert it's called by clean handler
    const isFilterEnable = jest.fn();
    const ctx = {
      state: { allPokemonsList: [], pokemonsTypes: [], pokemonGenderList: [] },
      getPokemonData: jest.fn(),
      dispatch: jest.fn(),
      setAppLoading: jest.fn(),
      getPokemonDetailsListByUrl: jest.fn(() => Promise.resolve([])),
    };

    render(
      <PokemonContext.Provider value={ctx as any}>
        <AppFilter isFilterEnable={isFilterEnable} />
      </PokemonContext.Provider>
    );

    // initially isOpen is "false"
    expect(screen.getByTestId("dropdown-Type-isOpen").textContent).toBe(
      "false"
    );

    // click open, component should re-render and isOpen becomes "true"
    fireEvent.click(screen.getByTestId("open-Type"));
    await waitFor(() => {
      expect(screen.getByTestId("dropdown-Type-isOpen").textContent).toBe(
        "true"
      );
    });

    // click close
    fireEvent.click(screen.getByTestId("close-Type"));
    await waitFor(() => {
      expect(screen.getByTestId("dropdown-Type-isOpen").textContent).toBe(
        "false"
      );
    });

    // click clean should call isFilterEnable(false)
    fireEvent.click(screen.getByTestId("clean-Type"));
    expect(isFilterEnable).toHaveBeenCalledWith(false);
  });
});
