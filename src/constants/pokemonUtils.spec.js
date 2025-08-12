// pokemonUtils.spec.js
import {
  POKEMON_TYPE,
  getBackground,
  getCamleCaseString,
  getPokcolor,
  getPokemonDescription,
} from "./pokemon.types.ts"; // adjust path if needed

describe("POKEMON_TYPE", () => {
  it("should have correct keys and colors", () => {
    expect(POKEMON_TYPE.grass.color).toBe("#C0D4C8");
    expect(POKEMON_TYPE.poison.color).toBe("#CFB7ED");
  });

  it("should have a typo 'nomrnal' instead of 'normal'", () => {
    expect(POKEMON_TYPE).toHaveProperty("nomrnal");
    expect(POKEMON_TYPE.nomrnal.color).toBe("#DDCBD0");
  });
});

describe("getPokcolor", () => {
  it("returns color for a known type", () => {
    expect(getPokcolor("grass")).toBe("#C0D4C8");
  });

  it("returns unknown color for an unknown type", () => {
    expect(getPokcolor("xyz")).toBe(POKEMON_TYPE.unknown.color);
  });

  it("returns unknown color for missing type", () => {
    expect(getPokcolor()).toBe(POKEMON_TYPE.unknown.color);
  });
});

describe("getBackground", () => {
  const typeObj = (name) => ({ type: { name } });

  it("returns color for single type", () => {
    expect(getBackground([typeObj("grass")])).toBe("#C0D4C8");
  });

  it("returns gradient for dual types", () => {
    expect(getBackground([typeObj("grass"), typeObj("poison")])).toBe(
      `linear-gradient(180deg, ${POKEMON_TYPE.grass.color} 0%, ${POKEMON_TYPE.poison.color} 100%)`
    );
  });

  it("returns empty string for no types", () => {
    expect(getBackground([])).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(getBackground(undefined)).toBe("");
  });
});

describe("getPokemonDescription", () => {
  it("returns combined unique English flavor texts", () => {
    const data = [
      { language: { name: "en" }, flavor_text: "Hello\nWorld" },
      { language: { name: "en" }, flavor_text: "Hello\nWorld" }, // duplicate
      { language: { name: "fr" }, flavor_text: "Bonjour" },
      { language: { name: "en" }, flavor_text: "Second\fLine" },
    ];
    expect(getPokemonDescription(data)).toBe("Hello WorldSecond Line");
  });

  it("returns undefined for empty array", () => {
    expect(getPokemonDescription([])).toBeUndefined();
  });

  it("returns undefined for no data passed", () => {
    expect(getPokemonDescription()).toBeUndefined();
  });
});

describe("getCamleCaseString", () => {
  it("capitalizes first letter", () => {
    expect(getCamleCaseString("pikachu")).toBe("Pikachu");
  });

  it("returns empty string for empty input", () => {
    expect(getCamleCaseString("")).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(getCamleCaseString()).toBe("");
  });

  it("works with single character string", () => {
    expect(getCamleCaseString("p")).toBe("P");
  });
});
