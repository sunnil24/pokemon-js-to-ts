import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import AppMultiSelectDropDown from "./multiSelectdropDown";

const mockData = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
];

describe("AppMultiSelectDropDown", () => {
  test("renders label correctly", () => {
    render(
      <AppMultiSelectDropDown
        label="Select Options"
        data={mockData}
        onChangeHandler={jest.fn()}
      />
    );

    expect(screen.getByText("Select Options")).toBeInTheDocument();
  });

  test("applies is-dropdown-open class when isOpen is true", () => {
    render(
      <AppMultiSelectDropDown
        label="Select Options"
        data={mockData}
        onChangeHandler={jest.fn()}
        isOpen={true}
      />
    );

    const wrapper = screen.getByRole("combobox").parentElement?.parentElement;
    expect(wrapper).toHaveClass("is-dropdown-open");
  });

  test("calls onChangeHandler when selection changes", () => {
    const handleChange = jest.fn();
    render(
      <AppMultiSelectDropDown
        label="Select Options"
        data={mockData}
        onChangeHandler={handleChange}
      />
    );

    const input = screen.getByRole("combobox");
    fireEvent.click(input);
    fireEvent.click(screen.getByText("Option 1"));

    expect(handleChange).toHaveBeenCalled();
  });

  test("uses custom placeholder", () => {
    render(
      <AppMultiSelectDropDown
        label="Select Options"
        data={mockData}
        onChangeHandler={jest.fn()}
        placeholder="Choose items"
      />
    );

    expect(screen.getByText("Choose items")).toBeInTheDocument();
  });
});
