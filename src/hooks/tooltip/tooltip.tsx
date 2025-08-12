import { forwardRef } from "react";
import { Popover, Whisper } from "rsuite";

interface DefaultPopoverProps {
  content: string;
  className?: string;
  [key: string]: any;
}

// Extract DefaultPopover out of the component to prevent recreation on every render
const DefaultPopover = forwardRef<any, DefaultPopoverProps>(
  ({ content, className, ...props }, ref) => {
    return (
      <Popover ref={ref} {...props} className={className} arrow={false}>
        <p>{content}</p>
      </Popover>
    );
  }
);

DefaultPopover.displayName = "DefaultPopover"; // Good practice for debugging

interface AppTooltipProps {
  placement: "top" | "bottom" | "left" | "right";
  data: string;
  className?: string;
  name: string;
  tooltipClass?: string;
  appearance?: string;
}

const AppTooltip = ({
  placement,
  data,
  className,
  name,
  tooltipClass,
  appearance,
}: AppTooltipProps) => {
  return (
    <Whisper
      trigger="click"
      placement={placement}
      controlId={`control-id-${placement}`}
      speaker={<DefaultPopover content={data} className={tooltipClass} />}
    >
      <div className={className}>{name}</div>
    </Whisper>
  );
};

export default AppTooltip;
