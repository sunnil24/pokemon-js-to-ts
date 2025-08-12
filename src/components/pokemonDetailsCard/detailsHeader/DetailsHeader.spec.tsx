// detailsHeader.spec.tsx

// ---- Mocks: MUST be before imports ----
jest.mock("../../../constants/pokemon.types", () => ({
  getPokemonDescription: jest.fn(() => "Mocked description ".repeat(40)), // long by default
}));
jest.mock("../../../services/common.service", () => ({
  numberFormation: jest.fn((id) => `#${id}`),
}));
jest.mock("../../pokemonCard/pokemonCard", () =>
  jest.fn(() => <div data-testid="mock-pokemon-card" />)
);
// Tooltip mock only renders if actually used
jest.mock("../../../hooks/tooltip/tooltip", () =>
  jest.fn(({ name }) => <div data-testid="mock-tooltip">{name}</div>)
);

import { render, screen } from "@testing-library/react";
import { getPokemonDescription } from "../../../constants/pokemon.types";
import DetailsHeader from "./detailsHeader";

// ---- Test data ----
const baseData = {
  id: 25,
  name: "Pikachu",
  sprites: {
    front_default: "",
    other: {},
  },
  types: [],
};
const baseSpeciesData = {
  flavor_text_entries: [{ flavor_text: "abc", language: { name: "en" } }],
};

// ---- Tests ----
describe("DetailsHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset default long description
    (getPokemonDescription as jest.Mock).mockReturnValue(
      "Mocked description ".repeat(40)
    );
  });

  it("renders pokemon name and number", () => {
    render(<DetailsHeader data={baseData} speciesData={baseSpeciesData} />);
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
  });

  it("renders truncated description when length > 363", () => {
    render(<DetailsHeader data={baseData} speciesData={baseSpeciesData} />);
    const descText = screen.getByText(/Mocked description/);
    expect(descText.textContent!.length).toBeLessThanOrEqual(364);
  });

  it("does not render tooltip if description length <= 363", () => {
    (getPokemonDescription as jest.Mock).mockReturnValue("short text");
    render(<DetailsHeader data={baseData} speciesData={baseSpeciesData} />);
    expect(screen.queryByTestId("mock-tooltip")).not.toBeInTheDocument();
  });
});
