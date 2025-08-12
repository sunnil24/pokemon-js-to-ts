import React from "react";

jest.mock("react-dom/client", () => {
  const mockRender = jest.fn();
  const mockCreateRoot = jest.fn(() => ({ render: mockRender }));
  return {
    createRoot: mockCreateRoot,
    // expose for test inspection
    __mock: { mockRender, mockCreateRoot },
  };
});

jest.mock("./App", () => () => <div>Mock App</div>);

describe("index.tsx", () => {
  beforeEach(() => {
    jest.resetModules(); // ensure we get a fresh import each time
    document.body.innerHTML = "";
  });

  it("calls createRoot with #root element and renders App", () => {
    // 1️⃣ Prepare DOM before importing
    const mockContainer = document.createElement("div");
    mockContainer.id = "root";
    document.body.appendChild(mockContainer);

    // 2️⃣ Import after mocks & DOM are ready
    const reactDomClient = require("react-dom/client");
    require("./index");

    // 3️⃣ Verify createRoot called correctly
    expect(reactDomClient.__mock.mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(reactDomClient.__mock.mockCreateRoot).toHaveBeenCalledWith(
      mockContainer
    );

    // 4️⃣ Verify render called once
    expect(reactDomClient.__mock.mockRender).toHaveBeenCalledTimes(1);

    const element = reactDomClient.__mock.mockRender.mock.calls[0][0];
    expect(element.type).toBe(React.StrictMode);
  });
});
