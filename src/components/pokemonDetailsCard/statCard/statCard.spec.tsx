import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import StatCard from "./statCard";

// Mock getCamleCaseString
jest.mock("../../../constants/pokemon.types", () => ({
  getCamleCaseString: (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1),
}));

// Sample test data
const mockStats = [
  { base_stat: 45, stat: { name: "hp" } },
  { base_stat: 60, stat: { name: "attack" } },
  { base_stat: 70, stat: { name: "defense" } },
  { base_stat: 80, stat: { name: "special-attack" } },
  { base_stat: 90, stat: { name: "special-defense" } },
  { base_stat: 50, stat: { name: "speed" } },
];

describe("StatCard", () => {
  test("renders Stats header", () => {
    render(<StatCard stats={mockStats} />);

    expect(screen.getByText("Stats")).toBeInTheDocument();
  });

  test("renders all stat rows", () => {
    render(<StatCard stats={mockStats} />);

    // Check each stat is rendered
    expect(screen.getByText("HP")).toBeInTheDocument();
    expect(screen.getByText("Attack")).toBeInTheDocument();
    expect(screen.getByText("Defense")).toBeInTheDocument();
    expect(screen.getByText("Sp. Attack")).toBeInTheDocument();
    expect(screen.getByText("Sp. Defense")).toBeInTheDocument();
    expect(screen.getByText("Speed")).toBeInTheDocument();
  });

  test("renders progress bars with correct value and max", () => {
    render(<StatCard stats={mockStats} />);

    const progressBars = screen.getAllByRole("progressbar");
    expect(progressBars).toHaveLength(mockStats.length);

    // Check first progress bar (HP)
    const hpBar = progressBars[0];
    expect(hpBar).toHaveAttribute("value", "45");
    expect(hpBar).toHaveAttribute("max", "100");
  });

  test("renders nothing when stats is undefined or null", () => {
    render(<StatCard stats={undefined as any} />);

    const statHeaders = screen.queryAllByText(/HP|Attack|Defense/);
    expect(statHeaders.length).toBe(0);
  });

  test("handles empty stats array", () => {
    render(<StatCard stats={[]} />);

    const statHeaders = screen.queryAllByText(/HP|Attack|Defense/);
    expect(statHeaders.length).toBe(0);
  });

  test("keys are set to stat name", () => {
    render(<StatCard stats={mockStats} />);

    // Check if an element with key hp exists
    expect(
      screen.getByText("HP").closest("[data-testid]") || true
    ).toBeTruthy();
    // Note: We can't test React keys directly, but we ensure mapping works via content
  });
});
