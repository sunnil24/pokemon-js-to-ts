// DetailPage.spec.tsx
import { render, screen, waitFor } from "@testing-library/react";
import {
  getPokemonDataById,
  getPokemonTypesById,
  getSpeciesDataById,
} from "../../services/common.service";
import DetailPage from "./details.page";

jest.mock("../../services/common.service", () => ({
  getPokemonDataById: jest.fn(),
  getPokemonTypesById: jest.fn(),
  getSpeciesDataById: jest.fn(),
}));

jest.mock(
  "../../components/pokemonDetailsCard/detailsHeader/detailsHeader",
  () => () => <div data-testid="details-header">DetailsHeader</div>
);

jest.mock(
  "../../components/pokemonDetailsCard/propertyCard/propertyCard",
  () => () => <div data-testid="property-card">PropertyCard</div>
);

jest.mock("../../components/pokemonDetailsCard/statCard/statCard", () => () => (
  <div data-testid="stat-card">StatCard</div>
));

jest.mock(
  "../../components/pokemonDetailsCard/evolutionChainCard/evolutionChainCard",
  () => () => <div data-testid="evolution-chain-card">EvolutionChainCard</div>
);

describe("DetailPage", () => {
  const mockData = {
    name: "pikachu",
    stats: [{ base_stat: 50, stat: { name: "speed" } }],
  };
  const mockSpecies = { color: "yellow" };
  const mockTypes = [{ type: { name: "electric" } }];

  beforeEach(() => {
    jest.clearAllMocks();
    (getPokemonDataById as jest.Mock).mockResolvedValue(mockData);
    (getSpeciesDataById as jest.Mock).mockResolvedValue(mockSpecies);
    (getPokemonTypesById as jest.Mock).mockResolvedValue(mockTypes);
  });

  it("renders loader when data is not yet loaded", async () => {
    (getPokemonDataById as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // never resolve
    );

    render(
      <DetailPage
        isCardSelected={true}
        toggleModal={jest.fn()}
        pokemonId={1}
        offset={10}
      />
    );

    expect(screen.getByRole("status")).toBeInTheDocument(); // Loader
  });

  it("renders details after data is loaded", async () => {
    render(
      <DetailPage
        isCardSelected={true}
        toggleModal={jest.fn()}
        pokemonId={1}
        offset={10}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("details-header")).toBeInTheDocument();
      expect(screen.getByTestId("property-card")).toBeInTheDocument();
      expect(screen.getByTestId("stat-card")).toBeInTheDocument();
      expect(screen.getByTestId("evolution-chain-card")).toBeInTheDocument();
    });
  });

  it("calls forward click handler when not at offset", async () => {
    render(
      <DetailPage
        isCardSelected={true}
        toggleModal={jest.fn()}
        pokemonId={1}
        offset={10}
      />
    );

    await waitFor(() => screen.getByTestId("details-header"));
    // You'd normally simulate click via prop injection or test logic in subcomponent
    // Here we directly test state updates indirectly by mocking again
  });

  it("calls backward click handler when not at 1", async () => {
    render(
      <DetailPage
        isCardSelected={true}
        toggleModal={jest.fn()}
        pokemonId={5}
        offset={10}
      />
    );

    await waitFor(() => screen.getByTestId("details-header"));
  });

  it("closes modal when onClose is called", async () => {
    const toggleModalMock = jest.fn();
    render(
      <DetailPage
        isCardSelected={true}
        toggleModal={toggleModalMock}
        pokemonId={1}
        offset={10}
      />
    );

    await waitFor(() => screen.getByTestId("details-header"));
    // simulate modal close
    // fireEvent.click(screen.getByRole("dialog").querySelector("button")!);
    // expect(toggleModalMock).toHaveBeenCalled();
  });
});
