// PokemonCard.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import PokemonCard from "./pokemonCard";

// Mock external functions
jest.mock("../../constants/pokemon.types", () => ({
  getBackground: jest.fn(() => "mocked-background"),
}));
jest.mock("../../services/common.service", () => ({
  numberFormation: jest.fn((num) => `#${num}`),
}));

describe("PokemonCard", () => {
  const mockOnClick = jest.fn();

  const baseData = {
    id: 25,
    name: "Pikachu",
    sprites: {
      front_default: "front_default.png",
      other: {
        dream_world: {
          front_default: "dream_world.png",
        },
        "official-artwork": {
          front_default: "official_artwork.png",
        },
      },
    },
    types: [{ type: { name: "electric" } }],
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("renders name and formatted id", () => {
    render(<PokemonCard data={baseData} />);
    expect(screen.getByText(/Pikachu/i)).toBeInTheDocument();
  });

  it("uses dream_world image if available", () => {
    render(<PokemonCard data={baseData} />);
    const img = screen.getByAltText("Pokemon Pikachu");
    expect(img).toHaveAttribute("src", "dream_world.png");
  });

  it("falls back to front_default if dream_world image is missing", () => {
    const modifiedData = {
      ...baseData,
      sprites: { ...baseData.sprites, other: {} },
    };
    render(<PokemonCard data={modifiedData} />);
    const img = screen.getByAltText("Pokemon Pikachu");
    expect(img).toHaveAttribute("src", "front_default.png");
  });

  it("falls back to placeholder if no image is available", () => {
    const modifiedData = {
      ...baseData,
      sprites: { front_default: undefined, other: {} },
    };
    render(<PokemonCard data={modifiedData} />);
    const img = screen.getByAltText("Pokemon Pikachu");
    expect(img).toHaveAttribute("src", "https://via.placeholder.com/150");
  });

  it("calls onClick when clicked", () => {
    render(<PokemonCard data={baseData} onClick={mockOnClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when pressing Enter", () => {
    render(<PokemonCard data={baseData} onClick={mockOnClick} />);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when pressing Space", () => {
    render(<PokemonCard data={baseData} onClick={mockOnClick} />);
    fireEvent.keyDown(screen.getByRole("button"), { key: " " });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(
      <PokemonCard data={baseData} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("card");
  });

  it("applies background style from getBackground", () => {
    const { container } = render(<PokemonCard data={baseData} />);
    expect(container.firstChild).toHaveStyle({
      background: "mocked-background",
    });
  });
});
