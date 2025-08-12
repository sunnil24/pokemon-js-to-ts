// ColorfulTag.test.jsx
import { render, screen } from "@testing-library/react";

// Mock getPokcolor so we can control the style output
jest.mock("../../../constants/pokemon.types", () => ({
  getPokcolor: jest.fn(() => "mocked-color"),
}));

import { getPokcolor } from "../../../constants/pokemon.types";
import ColorfulTag from "./colorfulTag";

describe("ColorfulTag", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the provided text", () => {
    render(<ColorfulTag text="Electric" type="electric" />);
    expect(screen.getByText("Electric")).toBeInTheDocument();
  });

  it("applies the given className to the wrapper div", () => {
    const { container } = render(
      <ColorfulTag text="Electric" className="custom-class" type="electric" />
    );

    // Outer wrapper is the first <div> inside the outermost <div>
    const innerWrapper = container.querySelector(".custom-class");
    expect(innerWrapper).toBeInTheDocument();
  });

  it("calls getPokcolor with the given type", () => {
    render(<ColorfulTag text="Electric" type="electric" />);
    expect(getPokcolor).toHaveBeenCalledWith("electric");
  });

  it("applies background color from getPokcolor", () => {
    render(<ColorfulTag text="Electric" type="electric" />);
    const tag = screen.getByText("Electric");
    expect(tag).toHaveStyle({ background: "mocked-color" });
  });
});
