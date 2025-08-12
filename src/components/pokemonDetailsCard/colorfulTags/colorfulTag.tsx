import { getPokcolor } from "../../../constants/pokemon.types";
import "./colorfulTags.scss";

const ColorfulTag = ({ text, className, type }) => {
  return (
    <div>
      <div className={className}>
        <span
          style={{
            background: getPokcolor(type),
          }}
          className="colorful-tag"
        >
          {text}
        </span>
      </div>
    </div>
  );
};

export default ColorfulTag;
