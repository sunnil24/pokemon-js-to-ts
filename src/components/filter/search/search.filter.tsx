import SearchIcon from "@rsuite/icons/Search";
import { Input, InputGroup } from "rsuite";
import "./search.filter.scss";

const SearchFilter = ({
  placeholder,
  inputClass,
  onChangeHandler,
  ...props
}) => {
  return (
    <>
      <div className="search-container">
        <div className="flex-col">
          <div className="search-label">
            <span>{props.label}</span>
          </div>
          <InputGroup {...props} inside className="mb-1">
            <Input
              placeholder={placeholder}
              className={inputClass}
              size="lg"
              onChange={onChangeHandler}
            />
            <InputGroup.Button>
              <SearchIcon />
            </InputGroup.Button>
          </InputGroup>
        </div>
      </div>
    </>
  );
};

export default SearchFilter;
