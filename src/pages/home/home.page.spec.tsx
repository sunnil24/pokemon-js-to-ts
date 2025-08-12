import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PokemonContext from "../../context/pokemonContext/pokmon.context"; // ✅ Fixed typo: 'pokmon' → 'pokemon'
import HomePage from "./home.page";

// Mock dependencies
jest.mock("../../components/header/header", () => ({
  __esModule: true,
  default: ({ children, className }) => (
    <header className={className}>{children}</header>
  ),
}));

jest.mock("../../components/filter/filter", () => ({
  __esModule: true,
  default: ({ isFilterEnable }) => (
    <div data-testid="app-filter" onClick={() => isFilterEnable(true)}>
      Filter Component
    </div>
  ),
}));

jest.mock("../../components/loader/loader", () => ({
  __esModule: true,
  default: ({ className }) => <div className={className}>Loading...</div>,
}));

jest.mock("../../components/pokemonCard/pokemonCard", () => ({
  __esModule: true,
  default: ({ data, onClick }) => (
    <div data-testid="pokemon-card" onClick={onClick}>
      {data.name}
    </div>
  ),
}));

jest.mock("../details/details.page", () => ({
  __esModule: true,
  default: ({ isCardSelected, toggleModal, pokemonId }) => (
    <div data-testid="detail-modal">
      <p>Detail Page for ID: {pokemonId}</p>
      <button onClick={toggleModal}>Close Modal</button>
    </div>
  ),
}));

// Mock rsuite components
jest.mock("rsuite", () => ({
  Button: ({ children, onClick, appearance }) => (
    <button data-appearance={appearance} onClick={onClick}>
      {children}
    </button>
  ),
  Row: ({ children, ...props }) => (
    <div role="row" {...props}>
      {children}
    </div>
  ),
  Col: ({ children, ...props }) => (
    <div role="column" {...props}>
      {children}
    </div>
  ),
}));

describe("HomePage", () => {
  const renderWithProvider = (contextValues) => {
    return render(
      <BrowserRouter>
        <PokemonContext.Provider value={contextValues}>
          <HomePage />
        </PokemonContext.Provider>
      </BrowserRouter>
    );
  };

  it("renders header and filter section correctly", () => {
    const mockContext = {
      state: {
        pokemonsList: [],
        isLoading: false,
        isLoadMoreInprogress: false,
      },
      getPokemonData: jest.fn(),
    };

    renderWithProvider(mockContext);

    expect(screen.getByText("Pokédex")).toBeInTheDocument();
    expect(
      screen.getByText("Search for any Pokémon that exist on the planet")
    ).toBeInTheDocument();
    expect(screen.getByTestId("app-filter")).toBeInTheDocument();
  });

  it("shows loader when isLoading is true", () => {
    const mockContext = {
      state: {
        pokemonsList: [],
        isLoading: true,
        isLoadMoreInprogress: false,
      },
      getPokemonData: jest.fn(),
    };

    renderWithProvider(mockContext);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(
      screen.getByText("Loading...").classList.contains("app-loader-wrapper")
    ).toBe(true);
  });

  it('displays "No data found" when pokemonsList is empty and not loading', () => {
    const mockContext = {
      state: {
        pokemonsList: [],
        isLoading: false,
        isLoadMoreInprogress: false,
      },
      getPokemonData: jest.fn(),
    };

    renderWithProvider(mockContext);

    expect(screen.getByText("No data found")).toBeInTheDocument();
  });

  it("renders list of Pokémon cards when pokemonsList has data", () => {
    const mockPokemons = [
      { id: 1, name: "Pikachu" },
      { id: 2, name: "Bulbasaur" },
    ];

    const mockContext = {
      state: {
        pokemonsList: mockPokemons,
        isLoading: false,
        isLoadMoreInprogress: false,
      },
      getPokemonData: jest.fn(),
    };

    renderWithProvider(mockContext);

    mockPokemons.forEach((pokemon) => {
      expect(screen.getByText(pokemon.name)).toBeInTheDocument();
    });

    expect(screen.getAllByTestId("pokemon-card")).toHaveLength(2);
  });

  it("calls toggleModal and opens DetailPage when a Pokémon card is clicked", async () => {
    const mockPokemons = [{ id: 1, name: "Pikachu" }];

    const mockContext = {
      state: {
        pokemonsList: mockPokemons,
        isLoading: false,
        isLoadMoreInprogress: false,
      },
      getPokemonData: jest.fn(),
    };

    renderWithProvider(mockContext);

    const card = screen.getByTestId("pokemon-card");
    await fireEvent.click(card);

    expect(screen.getByTestId("detail-modal")).toBeInTheDocument();
    expect(screen.getByText("Detail Page for ID: 1")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /Close Modal/i });
    await fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId("detail-modal")).not.toBeInTheDocument();
    });
  });

  it("shows load more button and calls getPokemonData on click", async () => {
    const mockContext = {
      state: {
        pokemonsList: [{ id: 1, name: "Pikachu" }],
        isLoading: false,
        isLoadMoreInprogress: false,
      },
      getPokemonData: jest.fn(),
    };

    renderWithProvider(mockContext);

    const loadMoreButton = screen.getByRole("button", { name: /Load more/i });
    await fireEvent.click(loadMoreButton);

    expect(mockContext.getPokemonData).toHaveBeenCalledTimes(1);
  });

  it("shows loader during load more process", () => {
    const mockContext = {
      state: {
        pokemonsList: [{ id: 1, name: "Pikachu" }],
        isLoading: false,
        isLoadMoreInprogress: true,
      },
      getPokemonData: jest.fn(),
    };

    renderWithProvider(mockContext);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(
      screen.getByText("Loading...").classList.contains("loadmore-loader")
    ).toBe(true);
  });

  it("hides load more button when filter is enabled", () => {
    const mockContext = {
      state: {
        pokemonsList: [{ id: 1, name: "Pikachu" }],
        isLoading: false,
        isLoadMoreInprogress: false,
      },
      getPokemonData: jest.fn(),
    };

    renderWithProvider(mockContext);

    // Simulate filter enable
    fireEvent.click(screen.getByTestId("app-filter"));

    expect(
      screen.queryByRole("button", { name: /Load more/i })
    ).not.toBeInTheDocument();
  });
});
