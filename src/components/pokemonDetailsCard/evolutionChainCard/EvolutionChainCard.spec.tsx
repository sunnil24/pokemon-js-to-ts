// evolutionChainCard.spec.tsx
import { render, screen } from "@testing-library/react";

// ---- Top-level mocks (must be before importing the component) ----
// Mock the right-arrow image import to a string path
jest.mock("../../../assets/icons/right-arrow.png", () => "right-arrow.png");

// Mock PokemonCard so tests don't depend on its implementation.
// Return a simple display of data.name (or fallback).
jest.mock("../../pokemonCard/pokemonCard", () => {
  return {
    __esModule: true,
    default: (props: any) => (
      <div data-testid="pokemon-card">
        {props.data?.name ?? "Unknown Pokemon"}
      </div>
    ),
  };
});

// Now import the component under test
import EvolutionChainCard from "./evolutionChainCard";

describe("EvolutionChainCard", () => {
  const mockData = { id: 25, name: "Pikachu" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders 3 PokemonCards with provided data", () => {
    render(<EvolutionChainCard data={mockData} />);
    const cards = screen.getAllByTestId("pokemon-card");
    expect(cards).toHaveLength(3);
    cards.forEach((card) => {
      expect(card).toHaveTextContent("Pikachu");
    });
  });

  it("renders arrow icons between cards but not after the last", () => {
    render(<EvolutionChainCard data={mockData} />);
    // arrows are images with role="presentation"
    const arrows = screen.getAllByRole("presentation");
    expect(arrows).toHaveLength(2); // 3 cards -> 2 arrows
    arrows.forEach((arrow) => {
      expect(arrow).toHaveAttribute("src", "right-arrow.png");
      expect(arrow).toHaveAttribute("alt", "right arrow icon");
    });
  });

  it("passes correct props to PokemonCard (mocked) and does not crash when data is undefined", () => {
    // when data is undefined, our defensive component passes {} to PokemonCard,
    // and the mock will render 'Unknown Pokemon' text for each card.
    render(<EvolutionChainCard data={undefined} />);
    const cards = screen.getAllByTestId("pokemon-card");
    expect(cards).toHaveLength(3);
    cards.forEach((card) => {
      expect(card).toHaveTextContent("Unknown Pokemon");
    });
  });
});
