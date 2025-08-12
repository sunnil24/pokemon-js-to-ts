// PokemonContext.spec.tsx
import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { initialState } from "../../store/reducers/reducer";
import PokemonContext from "./pokmon.context";

describe("PokemonContext", () => {
  it("should provide the initial state by default", () => {
    const TestComponent = () => {
      const contextValue = useContext(PokemonContext);
      return <div>{JSON.stringify(contextValue)}</div>;
    };

    render(
      <PokemonContext.Provider value={initialState}>
        <TestComponent />
      </PokemonContext.Provider>
    );

    expect(screen.getByText(JSON.stringify(initialState))).toBeInTheDocument();
  });

  it("should use default value if no provider is used", () => {
    const TestComponent = () => {
      const contextValue = useContext(PokemonContext);
      return <div>{JSON.stringify(contextValue)}</div>;
    };

    render(<TestComponent />);

    expect(screen.getByText(JSON.stringify(initialState))).toBeInTheDocument();
  });
});
