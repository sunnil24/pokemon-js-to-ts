import React from "react";
import { getBackground } from "../../constants/pokemon.types";
import { numberFormation } from "../../services/common.service";
import "./pokemonCard.scss";

interface PokemonCardData {
  id: number;
  name: string;
  sprites: {
    front_default?: string;
    other: {
      dream_world?: {
        front_default?: string;
      };
      "official-artwork"?: {
        front_default?: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}
interface PokemonCardProps {
  data: PokemonCardData;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  data,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      className={`${className} card`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.(e as any);
        }
      }}
      style={{
        background: getBackground(data.types),
        border: "none",
        padding: 0,
        width: "100%",
        cursor: "pointer",
      }}
    >
      <div className="image-container">
        <img
          src={
            data.sprites.other?.dream_world?.front_default ||
            data.sprites.front_default ||
            "https://via.placeholder.com/150"
          }
          alt={`Pokemon ${data.name}`}
        />
      </div>
      <div className="text-container">
        <strong>
          <b>{data.name}</b>
        </strong>
        <span>{numberFormation(data.id)}</span>
      </div>
    </button>
  );
};

export default PokemonCard;
