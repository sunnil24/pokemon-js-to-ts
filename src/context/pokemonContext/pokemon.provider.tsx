import React, { ReactNode, useEffect, useReducer, useRef } from "react";
import { allPokemonURL, initialURL } from "../../services/common.service";
import * as ACTIONS from "../../store/actions/pokemonAction";
import { initialState, reducer } from "../../store/reducers/reducer";
import PokemonContext from "./pokmon.context"; // Make sure the filename matches

// Define props type
interface PokemonProviderProps {
  children: ReactNode;
}

export const PokemonProvider: React.FC<PokemonProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const batchURL = useRef<string | null>(initialURL);

  const setAppLoading = (loading: boolean) => {
    dispatch({
      type: ACTIONS.SET_API_CALL_INPROGRESS,
      payload: loading,
    });
  };

  const setLoadMoreDataInprogress = (loading: boolean) => {
    dispatch({
      type: ACTIONS.SET_LOAD_MORE_API_CALL_INPROGRESS,
      payload: loading,
    });
  };

  const getPokemonData = async (isReset = false) => {
    if (isReset) {
      batchURL.current = initialURL;
    }
    if (!batchURL.current) return;

    setLoadMoreDataInprogress(true);

    try {
      const resp = await fetch(batchURL.current);
      const { next, results } = await resp.json();

      batchURL.current = next;
      const pokemonsList = await getPokemonDetailsListByUrl(results);
      setPokemonList(pokemonsList);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    } finally {
      setLoadMoreDataInprogress(false);
    }
  };

  const getPokemonDetailsListByUrl = async (
    results: { name: string; url: string }[]
  ) => {
    try {
      const pokemonsDetailsList = await Promise.all(
        results.map(async (pokemon) => {
          const response = await fetch(pokemon.url);
          if (!response.ok) throw new Error(`Failed to fetch ${pokemon.name}`);
          return await response.json();
        })
      );
      return pokemonsDetailsList;
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
      return [];
    }
  };

  const getAllPokemonDataList = async () => {
    try {
      const resp = await fetch(allPokemonURL);
      const { results } = await resp.json();
      dispatch({
        type: ACTIONS.SET_ALL_POKEMON_LIST,
        payload: results,
      });
    } catch (error) {
      console.error("Error fetching all Pokémon list:", error);
    }
  };

  const setPokemonList = (pokemonsList: any[]) => {
    dispatch({
      type: ACTIONS.SET_POKEMON_LIST,
      payload: pokemonsList,
    });
  };

  let count = 0;
  useEffect(() => {
    count += 1;
    if (count === 1) {
      getPokemonData().then(() => {
        if (state.isLoading) {
          setAppLoading(false);
        }
      });
      getAllPokemonDataList();
    }
  }, []);

  return (
    <PokemonContext.Provider
      value={{
        state,
        dispatch,
        getPokemonData,
        getPokemonDetailsListByUrl,
        setAppLoading,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export default PokemonProvider;
