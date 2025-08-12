// App.test.tsx
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

/**
 * Default/top-level mocks used by most tests.
 * These are synchronous simple mocks so tests run fast.
 */
jest.mock("./pages/home/home.page", () => {
  return { __esModule: true, default: () => <div>Home Page Mock</div> };
});
jest.mock("./pages/details/details.page", () => {
  return {
    __esModule: true,
    default: ({ isCardSelected, toggleModal, pokemonId }: any) => (
      <div>
        <div>Detail Page Mock - ID: {pokemonId}</div>
        <div>isCardSelected: {String(isCardSelected)}</div>
        <button onClick={toggleModal}>Close</button>
      </div>
    ),
  };
});
jest.mock("./context/pokemonContext/pokemon.provider", () => {
  return { PokemonProvider: ({ children }: any) => <div>{children}</div> };
});

// Import App AFTER the above top-level mocks so these tests use the simple mocks.
import App from "./App";

describe("App Routing (default mocks)", () => {
  it("renders HomePage on root route", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // findByText will wait until lazy resolves
    expect(await screen.findByText("Home Page Mock")).toBeInTheDocument();
  });

  it("renders DetailPage with correct pokemonId", async () => {
    render(
      <MemoryRouter initialEntries={["/details/25"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/Detail Page Mock - ID: 25/)
    ).toBeInTheDocument();
    expect(screen.getByText("isCardSelected: true")).toBeInTheDocument();
  });

  it("toggleModal updates state and calls history.back", async () => {
    const mockBack = jest
      .spyOn(window.history, "back")
      .mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={["/details/7"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/Detail Page Mock - ID: 7/)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));

    // toggleModal in wrapper calls window.history.back()
    expect(mockBack).toHaveBeenCalled();

    mockBack.mockRestore();
  });
});
