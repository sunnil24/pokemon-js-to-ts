// PokemonProvider.spec.tsx
import { render, waitFor } from "@testing-library/react";
import { useContext } from "react";
import PokemonProvider from "./pokemon.provider";
import PokemonContext from "./pokmon.context";

const mockPokemonResults = [
  { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25" },
];
const mockPokemonDetails = [{ id: 25, name: "pikachu" }];

// Mock fetch globally
global.fetch = jest.fn();

describe("PokemonProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("provides context with initial state and functions", () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useContext(PokemonContext);
      return <div>Test</div>;
    };

    render(
      <PokemonProvider>
        <TestComponent />
      </PokemonProvider>
    );

    expect(contextValue).toHaveProperty("state");
    expect(contextValue).toHaveProperty("dispatch");
    expect(typeof contextValue.getPokemonData).toBe("function");
    expect(typeof contextValue.getPokemonDetailsListByUrl).toBe("function");
    expect(typeof contextValue.setAppLoading).toBe("function");
  });

  it("fetches pokemon data and updates state on mount", async () => {
    // Mock the batch list fetch
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({
          next: null,
          results: mockPokemonResults,
        }),
      })
      // Mock each pokemon detail fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails[0],
      })
      // Mock allPokemonURL fetch
      .mockResolvedValueOnce({
        json: async () => ({
          results: mockPokemonResults,
        }),
      });

    let contextValue: any;

    const TestComponent = () => {
      contextValue = useContext(PokemonContext);
      return <div>Test</div>;
    };

    render(
      <PokemonProvider>
        <TestComponent />
      </PokemonProvider>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });

  it("getPokemonDetailsListByUrl returns empty array on fetch failure", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    let contextValue: any;

    const TestComponent = () => {
      contextValue = useContext(PokemonContext);
      return <div>Test</div>;
    };

    render(
      <PokemonProvider>
        <TestComponent />
      </PokemonProvider>
    );

    const result = await contextValue.getPokemonDetailsListByUrl([
      { name: "missing", url: "bad-url" },
    ]);
    expect(result).toEqual([]);
  });

  it("setAppLoading dispatches loading action", () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useContext(PokemonContext);
      return <div>Test</div>;
    };

    render(
      <PokemonProvider>
        <TestComponent />
      </PokemonProvider>
    );

    contextValue.setAppLoading(true);

    expect(contextValue.state.isLoading).toBe(true);
  });
});
