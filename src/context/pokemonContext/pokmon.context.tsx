import { createContext } from "react";
import { initialState } from "../../store/reducers/reducer";

const PokemonContext = createContext<any>(initialState);
export default PokemonContext;
