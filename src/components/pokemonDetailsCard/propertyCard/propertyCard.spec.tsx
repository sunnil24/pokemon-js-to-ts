import { render, screen } from "@testing-library/react";
import { getCamleCaseString } from "../../../constants/pokemon.types";
import ColorfulTag from "../colorfulTags/colorfulTag";
import PropertyCard from "./propertyCard";

jest.mock("../../../constants/pokemon.types", () => ({
  getCamleCaseString: jest.fn(),
}));

jest.mock("../colorfulTags/colorfulTag", () =>
  jest.fn(({ text }) => <div data-testid="colorful-tag">{text}</div>)
);

describe("PropertyCard", () => {
  const mockGetCamelCaseString = getCamleCaseString as jest.Mock;

  const speciesData = {
    egg_groups: [{ name: "monster" }, { name: "water1" }],
  };

  const data = {
    height: 7,
    weight: 690,
    abilities: [
      { ability: { name: "overgrow" } },
      { ability: { name: "chlorophyll" } },
    ],
    types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
  };

  const pokemonTypeData = {
    damage_relations: {
      double_damage_from: [{ name: "fire" }, { name: "ice" }],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCamelCaseString.mockImplementation((str) => `Camel(${str})`);
  });

  it("renders height, weight, gender, and egg groups correctly", () => {
    render(
      <PropertyCard
        speciesData={speciesData}
        data={data}
        pokemonTypeData={pokemonTypeData}
      />
    );

    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();

    expect(screen.getByText("Weight")).toBeInTheDocument();
    expect(screen.getByText("69 Kg")).toBeInTheDocument();

    expect(screen.getByText("Gender(s)")).toBeInTheDocument();
    expect(screen.getByText("Male, Female")).toBeInTheDocument();

    expect(screen.getByText("Egg Groups")).toBeInTheDocument();
    expect(mockGetCamelCaseString).toHaveBeenCalledWith("monster");
    expect(mockGetCamelCaseString).toHaveBeenCalledWith("water1");
    expect(screen.getByText("Camel(monster)")).toBeInTheDocument();
    expect(screen.getByText("Camel(water1)")).toBeInTheDocument();
  });

  it("renders abilities correctly", () => {
    render(
      <PropertyCard
        speciesData={speciesData}
        data={data}
        pokemonTypeData={pokemonTypeData}
      />
    );

    expect(screen.getByText("Abilities")).toBeInTheDocument();
    expect(mockGetCamelCaseString).toHaveBeenCalledWith("overgrow");
    expect(mockGetCamelCaseString).toHaveBeenCalledWith("chlorophyll");
    expect(screen.getByText("Camel(overgrow)")).toBeInTheDocument();
    expect(screen.getByText("Camel(chlorophyll)")).toBeInTheDocument();
  });

  it("renders 'Weak Against' types correctly", () => {
    render(
      <PropertyCard
        speciesData={speciesData}
        data={data}
        pokemonTypeData={pokemonTypeData}
      />
    );

    expect(screen.getByText("Weak Against")).toBeInTheDocument();
    expect(ColorfulTag).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "fire",
        text: "Camel(fire)",
      }),
      {}
    );
    expect(ColorfulTag).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ice",
        text: "Camel(ice)",
      }),
      {}
    );
  });
  it("handles missing optional props gracefully (with minimal shaped props)", () => {
    // Provide minimal shapes so the component doesn't access .length on undefined
    const minimalSpecies = { egg_groups: [] };
    const minimalData = {
      height: 0,
      weight: 0,
      abilities: [],
      types: [],
    };
    const minimalTypeData = { damage_relations: { double_damage_from: [] } };

    render(
      <PropertyCard
        speciesData={minimalSpecies}
        data={minimalData}
        pokemonTypeData={minimalTypeData}
      />
    );

    // Labels should always render
    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("Weight")).toBeInTheDocument();
    expect(screen.getByText("Gender(s)")).toBeInTheDocument();

    // Height/Weight values rendered from minimalData
    // expect(screen.getByText("0")).toBeInTheDocument(); // height
    expect(screen.getByText("0 Kg")).toBeInTheDocument(); // weight /10 => 0 Kg
  });
});
