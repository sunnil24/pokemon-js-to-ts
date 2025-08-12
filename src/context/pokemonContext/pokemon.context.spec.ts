import { render, screen } from "@testing-library/react";
import { createContext } from "react";
import { initialState } from "../../store/reducers/reducer";
import PokemonContext from "./pokmon.context"; // Adjust path as needed

// Mock component to test context consumption
const TestConsumer = () => {
  const context = useContext(PokemonContext);
  return (
    <div>
      <span>Filtered Pokemons: {context.filteredPokemonsList?.length}</span>
      <span>All Pokemons: {context.allPokemonsList?.length}</span>
      <span>Pokemon Types: {context.pokemonsTypes?.length}</span>
      <span>Gender List: {context.pokemonGenderList?.length}</span>
    </div>
  );
};

const { useContext } = createContext;

describe("PokemonContext", () => {
  test("provides the initial state as default value", () => {
    render(<TestConsumer />);

    // Assuming initialState has empty arrays (adjust based on actual initialState)
    expect(screen.getByText("Filtered Pokemons: 0")).toBeInTheDocument();
    expect(screen.getByText("All Pokemons: 0")).toBeInTheDocument();
    expect(screen.getByText("Pokemon Types: 0")).toBeInTheDocument();
    expect(screen.getByText("Gender List: 0")).toBeInTheDocument();
  });

  test("allows value to be overridden by Provider", () => {
    const customState = {
      filteredPokemonsList: [{ name: "pikachu", url: "/pokemon/25" }],
      allPokemonsList: [{ name: "bulbasaur", url: "/pokemon/1" }],
      pokemonsTypes: [{ label: "Electric", value: "/type/13" }],
      pokemonGenderList: [{ label: "Male", value: "/gender/1" }],
    };

    render(
      <PokemonContext.Provider value={customState}>
        <TestConsumer />
      </PokemonContext.Provider>
    );

    expect(screen.getByText("Filtered Pokemons: 1")).toBeInTheDocument();
    expect(screen.getByText("All Pokemons: 1")).toBeInTheDocument();
    expect(screen.getByText("Pokemon Types: 1")).toBeInTheDocument();
    expect(screen.getByText("Gender List: 1")).toBeInTheDocument();
  });

  test("PokemonContext is not null or undefined", () => {
    expect(PokemonContext).not.toBeNull();
    expect(PokemonContext).toBeDefined();
    expect(typeof PokemonContext.Provider).toBe("function");
    expect(typeof PokemonContext.Consumer).toBe("function"); // Optional: if using Consumer pattern
  });
});
