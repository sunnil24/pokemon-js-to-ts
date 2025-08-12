// evolutionChainCard.tsx
import rightArrowIcon from "../../../assets/icons/right-arrow.png";
import "../../../styles/common.scss";
import PokemonCard from "../../pokemonCard/pokemonCard";
import "./evolutionChainCard.scss";

const EvolutionChainCard = ({ data }: any) => {
  const arrayele = [1, 2, 3];

  return (
    <div>
      <div className="evol-container">
        <div className="evol-wrap evolu-break">
          {arrayele?.map((obj, index) => (
            <div className="flex-row" key={index}>
              <div>
                <div className="pt-2">
                  <PokemonCard
                    className="disabled-click"
                    // provide fallback key and fallback data to avoid crashes
                    key={data?.id ?? index}
                    data={data ?? {}}
                  />
                </div>
              </div>
              {arrayele.length !== index + 1 && (
                <div>
                  <div className="evol-next-arrow">
                    <img
                      src={rightArrowIcon}
                      alt="right arrow icon"
                      onKeyDown={() => {}}
                      role="presentation"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvolutionChainCard;
