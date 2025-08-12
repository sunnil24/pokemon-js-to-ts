// Apploader.test.jsx
import { render, screen } from "@testing-library/react";
import Apploader from "./loader";

describe("Apploader", () => {
  it("renders the loader content", () => {
    render(<Apploader className="custom-loader" />);

    // Check the text content passed to Loader
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("applies the passed className", () => {
    const { container } = render(<Apploader className="custom-loader" />);

    // First child is the wrapping div
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-loader");
  });
});
