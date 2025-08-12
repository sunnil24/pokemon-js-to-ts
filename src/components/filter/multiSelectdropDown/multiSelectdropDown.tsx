import { CheckPicker } from "rsuite";
import "./multiSelectdropDown.scss";

interface AppMultiSelectDropDownProps {
  label: string;
  data: Array<{ label: string; value: any }>;
  onChangeHandler: (value: any[], event: React.SyntheticEvent) => void;
  placeholder?: string;
  onOpenHandler?: (event?: any) => void;
  onCloseHandler?: (event?: any) => void;
  onCleanHandler?: (event?: any) => void;
  isOpen?: boolean;
}

export const AppMultiSelectDropDown = ({
  label,
  data,
  onChangeHandler,
  placeholder = "Select...",
  onOpenHandler,
  onCloseHandler,
  onCleanHandler,
  isOpen = false,
  ...props
}: AppMultiSelectDropDownProps) => {
  return (
    <div className="multiselect-dropdown-wrapper">
      <div className="dropdown-label">
        <label htmlFor="check-picker-input">{label}</label>
      </div>
      <div className={`check-picker-wrap ${isOpen ? "is-dropdown-open" : ""}`}>
        <CheckPicker
          id="check-picker-input"
          block
          size="lg"
          placeholder={placeholder}
          onChange={onChangeHandler}
          onOpen={onOpenHandler}
          onClose={onCloseHandler}
          onClean={onCleanHandler}
          data={data}
          searchable={false}
          style={{ width: 224 }}
          // Pass any additional rsuite-compatible props
          {...props}
        />
      </div>
    </div>
  );
};

export default AppMultiSelectDropDown;
