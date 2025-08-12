// SearchFilter.test.jsx
import { fireEvent, render, screen } from "@testing-library/react";
import SearchFilter from "./search.filter";

describe("SearchFilter", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders the label text", () => {
    render(
      <SearchFilter
        label="Search Items"
        placeholder="Type to search..."
        onChangeHandler={mockOnChange}
      />
    );

    expect(screen.getByText("Search Items")).toBeInTheDocument();
  });

  it("renders the input with placeholder", () => {
    render(
      <SearchFilter
        label="Search"
        placeholder="Search here..."
        onChangeHandler={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText("Search here...");
    expect(input).toBeInTheDocument();
  });

  it("calls onChangeHandler when typing in input", () => {
    render(
      <SearchFilter
        label="Search"
        placeholder="Search here..."
        onChangeHandler={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText("Search here...");

    fireEvent.input(input, { target: { value: "apple" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("apple", expect.any(Object));
  });

  it("renders the search icon button", () => {
    render(
      <SearchFilter
        label="Search"
        placeholder="Search here..."
        onChangeHandler={mockOnChange}
      />
    );

    // The SearchIcon doesn't have text, so check for its role inside the button
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button.querySelector("svg")).toBeTruthy();
  });
});
