import { LIMIT, baseURL } from "../constants/apiUrls";
import {
  allPokemonURL,
  getAllParallelCall,
  getPokemonData,
  getPokemonDataById,
  getPokemonDataByURL,
  getPokemonGenders,
  getPokemonTypes,
  getPokemonTypesById,
  getSpeciesDataById,
  initialURL,
  numberFormation,
  removeDuplicateBy,
} from "./common.service"; // Adjust path as needed

// Mock global fetch
global.fetch = jest.fn();

const mockFetch = () => fetch as jest.MockedFunction<typeof fetch>;

describe("common.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("API URL Constants", () => {
    test("initialURL should include limit", () => {
      expect(initialURL).toBe(`${baseURL}/pokemon?limit=${LIMIT}`);
    });

    test("allPokemonURL should have limit 1100", () => {
      expect(allPokemonURL).toBe(`${baseURL}/pokemon?limit=1100`);
    });
  });

  describe("getPokemonData", () => {
    test("fetches initial Pokémon list", async () => {
      const mockData = { results: [{ name: "pikachu", url: "/pokemon/25" }] };
      mockFetch().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as unknown as Response);

      const result = await getPokemonData();

      expect(fetch).toHaveBeenCalledWith(initialURL);
      expect(result).toEqual(mockData);
    });
  });

  describe("getSpeciesDataById", () => {
    test("fetches species data by ID", async () => {
      const mockData = { name: "pikachu", is_legendary: false };
      mockFetch().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as unknown as Response);

      const result = await getSpeciesDataById(25);

      expect(fetch).toHaveBeenCalledWith(`${baseURL}/pokemon-species/25/`);
      expect(result).toEqual(mockData);
    });
  });

  describe("getPokemonTypesById", () => {
    test("fetches type data by ID", async () => {
      const mockData = { name: "electric", damage_relations: {} };
      mockFetch().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as unknown as Response);

      const result = await getPokemonTypesById(13);

      expect(fetch).toHaveBeenCalledWith(`${baseURL}/type/13/`);
      expect(result).toEqual(mockData);
    });
  });

  describe("getPokemonTypes", () => {
    test("fetches all Pokémon types", async () => {
      const mockData = { results: [{ name: "fire", url: "/type/10/" }] };
      mockFetch().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as unknown as Response);

      const result = await getPokemonTypes();

      expect(fetch).toHaveBeenCalledWith(`${baseURL}/type`);
      expect(result).toEqual(mockData);
    });
  });

  describe("getPokemonGenders", () => {
    test("fetches all Pokémon genders", async () => {
      const mockData = {
        results: [{ name: "male", pokemon_species_count: 100 }],
      };
      mockFetch().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as unknown as Response);

      const result = await getPokemonGenders();

      expect(fetch).toHaveBeenCalledWith(`${baseURL}/gender`);
      expect(result).toEqual(mockData);
    });
  });

  describe("getPokemonDataById", () => {
    test("fetches Pokémon data by ID", async () => {
      const mockData = { name: "pikachu", id: 25 };
      mockFetch().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as unknown as Response);

      const result = await getPokemonDataById(25);

      expect(fetch).toHaveBeenCalledWith(`${baseURL}/pokemon/25/`);
      expect(result).toEqual(mockData);
    });
  });

  describe("getPokemonDataByURL", () => {
    test("fetches data from custom URL", async () => {
      const customUrl = "/api/v2/pokemon/25/";
      const mockData = { name: "pikachu" };
      mockFetch().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as unknown as Response);

      const result = await getPokemonDataByURL(customUrl);

      expect(fetch).toHaveBeenCalledWith(customUrl);
      expect(result).toEqual(mockData);
    });
  });

  describe("numberFormation", () => {
    test("formats numbers with leading zeros", () => {
      expect(numberFormation(5)).toBe("005");
      expect(numberFormation(10)).toBe(10);
      expect(numberFormation(42)).toBe("042");
      expect(numberFormation(100)).toBe(100);
      expect(numberFormation(999)).toBe(999);
    });
  });

  describe("getAllParallelCall", () => {
    test("makes parallel requests to multiple URLs", async () => {
      const urls = [
        `${baseURL}/pokemon/1/`,
        `${baseURL}/pokemon/2/`,
        `${baseURL}/pokemon/3/`,
      ];
      const mockResponses = [
        { name: "bulbasaur" },
        { name: "ivysaur" },
        { name: "venusaur" },
      ];

      mockFetch()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponses[0],
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponses[1],
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponses[2],
        } as unknown as Response);

      const result = await getAllParallelCall(urls);

      expect(result).toEqual(mockResponses);
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    test("handles fetch errors gracefully", async () => {
      const urls = [`${baseURL}/pokemon/1/`, `${baseURL}/pokemon/2/`];
      mockFetch().mockRejectedValueOnce(new Error("Network error"));

      await expect(getAllParallelCall(urls)).rejects.toThrow();
    });
  });

  describe("removeDuplicateBy", () => {
    interface TestItem {
      id: number;
      name: string;
      category?: string;
    }

    const testData: TestItem[] = [
      { id: 1, name: "pikachu" },
      { id: 2, name: "pikachu" },
      { id: 3, name: "bulbasaur" },
      { id: 4, name: "pikachu" },
    ];

    test("removes duplicates based on a key", () => {
      const result = removeDuplicateBy(testData, "name");
      expect(result).toHaveLength(2);
      expect(result.map((i) => i.name)).toEqual(["pikachu", "bulbasaur"]);
      expect(result[0].id).toBe(4); // Keeps first occurrence
    });

    test("works with different property", () => {
      const data = [
        { id: 1, code: "A" },
        { id: 2, code: "B" },
        { id: 3, code: "A" },
      ];
      const result = removeDuplicateBy(data, "code");
      expect(result).toHaveLength(2);
      expect(result.map((i) => i.code)).toEqual(["A", "B"]);
    });

    test("returns empty array when input is empty", () => {
      const result = removeDuplicateBy([], "id");
      expect(result).toEqual([]);
    });
  });
});
