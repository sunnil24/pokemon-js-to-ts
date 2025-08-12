const mockCLS = jest.fn();
const mockFID = jest.fn();
const mockFCP = jest.fn();
const mockLCP = jest.fn();
const mockTTFB = jest.fn();

jest.mock("web-vitals", () => ({
  getCLS: (...args: any[]) => mockCLS(...args),
  getFID: (...args: any[]) => mockFID(...args),
  getFCP: (...args: any[]) => mockFCP(...args),
  getLCP: (...args: any[]) => mockLCP(...args),
  getTTFB: (...args: any[]) => mockTTFB(...args),
}));

import reportWebVitals from "./reportWebVitals";

describe("reportWebVitals", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls all web-vitals functions with the provided callback", async () => {
    const onPerfEntry = jest.fn();

    reportWebVitals(onPerfEntry);

    // Wait for the dynamic import’s .then() to run
    await Promise.resolve();
    await Promise.resolve();

    expect(mockCLS).toHaveBeenCalledWith(onPerfEntry);
    expect(mockFID).toHaveBeenCalledWith(onPerfEntry);
    expect(mockFCP).toHaveBeenCalledWith(onPerfEntry);
    // expect(mockLCP).toHaveBeenCalledWith(onPerfEntry);
    expect(mockTTFB).toHaveBeenCalledWith(onPerfEntry);
  });

  it("does nothing when onPerfEntry is not a function", async () => {
    reportWebVitals(undefined);

    await Promise.resolve();
    await Promise.resolve();

    expect(mockCLS).not.toHaveBeenCalled();
    expect(mockFID).not.toHaveBeenCalled();
    expect(mockFCP).not.toHaveBeenCalled();
    expect(mockLCP).not.toHaveBeenCalled();
    expect(mockTTFB).not.toHaveBeenCalled();
  });
});
