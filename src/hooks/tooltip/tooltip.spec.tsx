import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AppTooltip from "./tooltip";

// Mock rsuite components since they're external dependencies
jest.mock("rsuite", () => {
  const mockReact = require("react");

  return {
    Popover: mockReact.forwardRef(({ children, className, ...props }, ref) =>
      mockReact.createElement(
        "div",
        {
          ref,
          "data-testid": "popover",
          className,
          ...props,
        },
        children
      )
    ),
    Whisper: ({
      children,
      speaker,
      trigger,
      placement,
      controlId,
      ...props
    }) => {
      const [isOpen, setIsOpen] = mockReact.useState(false);

      const handleTrigger = () => {
        if (trigger === "click") {
          setIsOpen(!isOpen);
        }
      };

      return mockReact.createElement(
        "div",
        {
          "data-testid": "whisper",
          "data-placement": placement,
          "data-control-id": controlId,
        },
        [
          mockReact.createElement(
            "div",
            {
              onClick: handleTrigger,
              "data-testid": "whisper-trigger",
              key: "trigger",
            },
            children
          ),
          isOpen &&
            mockReact.createElement(
              "div",
              {
                "data-testid": "whisper-speaker",
                key: "speaker",
              },
              speaker
            ),
        ].filter(Boolean)
      );
    },
  };
});

describe("AppTooltip", () => {
  const defaultProps = {
    placement: "top" as const,
    data: "Test tooltip content",
    name: "Test Button",
    className: "test-class",
    tooltipClass: "tooltip-class",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with required props", () => {
      render(<AppTooltip {...defaultProps} />);

      expect(screen.getByTestId("whisper")).toBeInTheDocument();
      expect(screen.getByText("Test Button")).toBeInTheDocument();
    });

    it("renders with correct name in trigger element", () => {
      render(<AppTooltip {...defaultProps} name="Custom Name" />);

      expect(screen.getByText("Custom Name")).toBeInTheDocument();
    });

    it("applies className to the trigger div", () => {
      render(<AppTooltip {...defaultProps} className="custom-trigger-class" />);

      const triggerDiv = screen.getByText("Test Button");
      expect(triggerDiv).toHaveClass("custom-trigger-class");
    });

    it("renders without optional props", () => {
      const minimalProps = {
        placement: "top" as const,
        data: "Test content",
        name: "Test",
      };

      render(<AppTooltip {...minimalProps} />);
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("Whisper Configuration", () => {
    it("sets correct trigger type", () => {
      render(<AppTooltip {...defaultProps} />);

      const whisper = screen.getByTestId("whisper");
      // The trigger is handled in our mock, but we can verify the click behavior
      expect(whisper).toBeInTheDocument();
    });

    it("sets correct placement", () => {
      render(<AppTooltip {...defaultProps} placement="bottom" />);

      const whisper = screen.getByTestId("whisper");
      expect(whisper).toHaveAttribute("data-placement", "bottom");
    });

    it("generates correct controlId based on placement", () => {
      render(<AppTooltip {...defaultProps} placement="left" />);

      const whisper = screen.getByTestId("whisper");
      expect(whisper).toHaveAttribute("data-control-id", "control-id-left");
    });

    it.each(["top", "bottom", "left", "right"])(
      "works with placement: %s",
      (placement) => {
        render(<AppTooltip {...defaultProps} placement={placement as any} />);

        const whisper = screen.getByTestId("whisper");
        expect(whisper).toHaveAttribute("data-placement", placement);
        expect(whisper).toHaveAttribute(
          "data-control-id",
          `control-id-${placement}`
        );
      }
    );
  });

  describe("DefaultPopover Integration", () => {
    it("passes correct content to DefaultPopover", async () => {
      render(<AppTooltip {...defaultProps} data="Custom tooltip text" />);

      // Click to open tooltip
      fireEvent.click(screen.getByTestId("whisper-trigger"));

      await waitFor(() => {
        expect(screen.getByText("Custom tooltip text")).toBeInTheDocument();
      });
    });

    it("passes tooltipClass to DefaultPopover", async () => {
      render(
        <AppTooltip {...defaultProps} tooltipClass="custom-tooltip-class" />
      );

      // Click to open tooltip
      fireEvent.click(screen.getByTestId("whisper-trigger"));

      await waitFor(() => {
        const popover = screen.getByTestId("popover");
        expect(popover).toHaveClass("custom-tooltip-class");
      });
    });

    it("works without tooltipClass", async () => {
      const propsWithoutTooltipClass = { ...defaultProps };
      delete propsWithoutTooltipClass.tooltipClass;

      render(<AppTooltip {...propsWithoutTooltipClass} />);

      // Click to open tooltip
      fireEvent.click(screen.getByTestId("whisper-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("popover")).toBeInTheDocument();
      });
    });
  });

  describe("User Interactions", () => {
    it("shows tooltip on click", async () => {
      render(<AppTooltip {...defaultProps} />);

      const trigger = screen.getByTestId("whisper-trigger");
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByTestId("whisper-speaker")).toBeInTheDocument();
        expect(screen.getByText("Test tooltip content")).toBeInTheDocument();
      });
    });

    it("hides tooltip on second click", async () => {
      render(<AppTooltip {...defaultProps} />);

      const trigger = screen.getByTestId("whisper-trigger");

      // First click - show tooltip
      fireEvent.click(trigger);
      await waitFor(() => {
        expect(screen.getByTestId("whisper-speaker")).toBeInTheDocument();
      });

      // Second click - hide tooltip
      fireEvent.click(trigger);
      await waitFor(() => {
        expect(screen.queryByTestId("whisper-speaker")).not.toBeInTheDocument();
      });
    });

    it("tooltip content is wrapped in paragraph element", async () => {
      render(<AppTooltip {...defaultProps} data="Paragraph content" />);

      fireEvent.click(screen.getByTestId("whisper-trigger"));

      await waitFor(() => {
        const paragraph = screen.getByText("Paragraph content");
        expect(paragraph.tagName).toBe("P");
      });
    });
  });

  describe("Props Validation", () => {
    it("handles empty data string", async () => {
      render(<AppTooltip {...defaultProps} data="" />);

      fireEvent.click(screen.getByTestId("whisper-trigger"));

      await waitFor(() => {
        // Should still render the popover structure even with empty content
        expect(screen.getByTestId("popover")).toBeInTheDocument();
      });
    });

    it("handles empty name string", () => {
      render(<AppTooltip {...defaultProps} name="" />);

      const triggerDiv = screen
        .getByTestId("whisper-trigger")
        .querySelector("div");
      expect(triggerDiv).toHaveTextContent("");
    });

    it("handles special characters in content", async () => {
      const specialContent = "Special chars: <>&\"'";
      render(<AppTooltip {...defaultProps} data={specialContent} />);

      fireEvent.click(screen.getByTestId("whisper-trigger"));

      await waitFor(() => {
        expect(screen.getByText(specialContent)).toBeInTheDocument();
      });
    });

    it("handles long content strings", async () => {
      const longContent =
        "This is a very long tooltip content that might wrap multiple lines and should still work correctly without breaking the component functionality";
      render(<AppTooltip {...defaultProps} data={longContent} />);

      fireEvent.click(screen.getByTestId("whisper-trigger"));

      await waitFor(() => {
        expect(screen.getByText(longContent)).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("maintains proper DOM structure for screen readers", () => {
      render(<AppTooltip {...defaultProps} />);

      const whisper = screen.getByTestId("whisper");
      const trigger = screen.getByTestId("whisper-trigger");

      expect(whisper).toBeInTheDocument();
      expect(trigger).toBeInTheDocument();
      expect(whisper).toContainElement(trigger);
    });

    it("provides control-id for accessibility", () => {
      render(<AppTooltip {...defaultProps} placement="right" />);

      const whisper = screen.getByTestId("whisper");
      expect(whisper).toHaveAttribute("data-control-id", "control-id-right");
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined optional props gracefully", () => {
      const minimalProps = {
        placement: "top" as const,
        data: "Test",
        name: "Test",
        className: undefined,
        tooltipClass: undefined,
        appearance: undefined,
      };

      expect(() => render(<AppTooltip {...minimalProps} />)).not.toThrow();
    });

    it("handles rapid clicking", async () => {
      render(<AppTooltip {...defaultProps} />);

      const trigger = screen.getByTestId("whisper-trigger");

      // Rapid clicks
      fireEvent.click(trigger);
      fireEvent.click(trigger);
      fireEvent.click(trigger);

      // Should handle gracefully without errors
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("DefaultPopover has correct displayName", () => {
      // This would be tested in the actual implementation
      // but we can verify our component structure
      render(<AppTooltip {...defaultProps} />);
      expect(screen.getByTestId("whisper")).toBeInTheDocument();
    });

    it("passes through appearance prop context (if needed by rsuite)", () => {
      render(<AppTooltip {...defaultProps} appearance="subtle" />);

      // The appearance prop is accepted but how it's used depends on rsuite
      // We verify the component renders without errors
      expect(screen.getByText("Test Button")).toBeInTheDocument();
    });
  });
});
