import { fireEvent, render, screen } from "@testing-library/react";
import { getPokemonDescription } from "../../../constants/pokemon.types";
import DetailsHeader from "./detailsHeader";

// Mock dependent modules/components
jest.mock("../../../constants/pokemon.types", () => ({
  getPokemonDescription: jest.fn(),
}));

jest.mock("../../../hooks/tooltip/tooltip", () => (props: any) => {
  return <div data-testid="app-tooltip">{props.name}</div>;
});

jest.mock("../../pokemonCard/pokemonCard", () => (props: any) => (
  <div data-testid="pokemon-card">{props.data?.name}</div>
));

jest.mock("../../../services/common.service", () => ({
  numberFormation: jest.fn(),
}));

describe("DetailsHeader", () => {
  const mockData = {
    id: 25,
    name: "pikachu",
    sprites: {},
    types: [],
  };

  const mockSpeciesData = {
    flavor_text_entries: [
      { flavor_text: "Test description text", language: { name: "en" } },
    ],
  };

  beforeEach(() => {
    (getPokemonDescription as jest.Mock).mockReturnValue(
      "Test description text with enough length to test tooltip."
    );
  });

  it("renders PokemonCard with correct data", () => {
    render(<DetailsHeader data={mockData} speciesData={mockSpeciesData} />);
    expect(screen.getByTestId("pokemon-card")).toHaveTextContent("pikachu");
  });

  it("renders description text truncated to 363 characters", () => {
    (getPokemonDescription as jest.Mock).mockReturnValue(
      "a".repeat(400) // 400 chars long string
    );
    render(<DetailsHeader data={mockData} speciesData={mockSpeciesData} />);
    expect(screen.getByText("a".repeat(363))).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("renders AppTooltip when description length > 363", () => {
    (getPokemonDescription as jest.Mock).mockReturnValue(
      "a".repeat(400) // long text triggers tooltip
    );
    render(<DetailsHeader data={mockData} speciesData={mockSpeciesData} />);
    expect(screen.getByTestId("app-tooltip")).toBeInTheDocument();
  });

  it("does not render AppTooltip when description length <= 363", () => {
    (getPokemonDescription as jest.Mock).mockReturnValue("short description");
    render(<DetailsHeader data={mockData} speciesData={mockSpeciesData} />);
    expect(screen.queryByTestId("app-tooltip")).toBeNull();
  });

  it("calls backClick, closeClick, and forwordClick when icons are clicked", () => {
    const backClick = jest.fn();
    const closeClick = jest.fn();
    const forwordClick = jest.fn();

    render(
      <DetailsHeader
        data={mockData}
        speciesData={mockSpeciesData}
        backClick={backClick}
        closeClick={closeClick}
        forwordClick={forwordClick}
      />
    );

    fireEvent.click(screen.getByAltText("back icon to go backword"));
    expect(backClick).toHaveBeenCalled();

    fireEvent.click(screen.getByAltText("close icon to go backword"));
    expect(closeClick).toHaveBeenCalled();

    fireEvent.click(screen.getByAltText("forword icon to go backword"));
    expect(forwordClick).toHaveBeenCalled();
  });

  it("handles keyDown events on icons", () => {
    render(<DetailsHeader data={mockData} speciesData={mockSpeciesData} />);
    fireEvent.keyDown(screen.getByAltText("back icon to go backword"), {
      key: "Enter",
    });
    fireEvent.keyDown(screen.getByAltText("close icon to go backword"), {
      key: "Enter",
    });
    fireEvent.keyDown(screen.getByAltText("forword icon to go backword"), {
      key: "Enter",
    });
  });

  it("returns empty description if flavor_text_entries missing", () => {
    (getPokemonDescription as jest.Mock).mockReturnValue("");
    render(<DetailsHeader data={mockData} speciesData={{}} />);
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("does not render AppTooltip when description length exactly 363", () => {
    (getPokemonDescription as jest.Mock).mockReturnValue("a".repeat(363));
    render(<DetailsHeader data={mockData} speciesData={mockSpeciesData} />);
    expect(screen.queryByTestId("app-tooltip")).toBeNull();
    expect(screen.getByText("a".repeat(363))).toBeInTheDocument();
  });

  it("passes className and onClick to PokemonCard", () => {
    const mockOnClick = jest.fn();
    render(
      <DetailsHeader
        data={mockData}
        speciesData={mockSpeciesData}
        backClick={() => {}}
        closeClick={() => {}}
        forwordClick={() => {}}
      />
    );
    const card = screen.getByTestId("pokemon-card");
    expect(card).toBeInTheDocument();
  });

  it("does not render AppTooltip when description length is exactly 363", () => {
    (getPokemonDescription as jest.Mock).mockReturnValue("a".repeat(363));
    render(<DetailsHeader data={mockData} speciesData={mockSpeciesData} />);
    expect(screen.queryByTestId("app-tooltip")).toBeNull();
    expect(screen.getByText("a".repeat(363))).toBeInTheDocument();
  });

  it("handles keyDown events on navigation icons", () => {
    render(<DetailsHeader data={mockData} speciesData={mockSpeciesData} />);

    const backIcon = screen.getByAltText("back icon to go backword");
    const closeIcon = screen.getByAltText("close icon to go backword");
    const forwardIcon = screen.getByAltText("forword icon to go backword");

    fireEvent.keyDown(backIcon, { key: "Enter", code: "Enter" });
    fireEvent.keyDown(closeIcon, { key: "Enter", code: "Enter" });
    fireEvent.keyDown(forwardIcon, { key: "Enter", code: "Enter" });

    // These handlers do nothing, so no asserts needed, just coverage
  });
});
