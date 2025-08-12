import { render, screen } from "@testing-library/react";
import Header from "./header";

describe("Header", () => {
  test("renders children correctly", () => {
    render(
      <Header>
        <h1>Hello World</h1>
      </Header>
    );

    const headingElement = screen.getByRole("heading", { level: 1 });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent("Hello World");
  });

  test("applies the correct className", () => {
    render(
      <Header>
        <div>Content</div>
      </Header>
    );

    const headerElement = screen.getByRole("banner"); // <header> elements default to role="banner"
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveClass("header");
  });

  test("renders multiple children", () => {
    render(
      <Header>
        <span>Child 1</span>
        <span>Child 2</span>
      </Header>
    );

    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  test("renders text content", () => {
    render(<Header>Plain Text</Header>);

    expect(screen.getByText("Plain Text")).toBeInTheDocument();
  });
});
