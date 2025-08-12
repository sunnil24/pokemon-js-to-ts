import { useEffect, useReducer, useRef } from "react";
import { allPokemonURL, initialURL } from "../../services/common.service";
import * as ACTIONS from "../../store/actions/pokemonAction"; // Uncomment and import actions
import { initialState, reducer } from "../../store/reducers/reducer";
import PokemonContext from "./pokemon.context"; // Fixed typo: "pokmon" -> "pokemon"

export const PokemonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const batchURL = useRef(initialURL);

  // Set global app loading state
  const setAppLoading = (loading) => {
    dispatch({
      // @ts-ignore
      type: ACTIONS.SET_API_CALL_INPROGRESS,
      payload: loading,
    });
  };

  // Set loading state for "load more"
  const setLoadMoreDataInprogress = (loading) => {
    dispatch({
      // @ts-ignore
      type: ACTIONS.SET_LOAD_MORE_API_CALL_INPROGRESS,
      payload: loading,
    });
  };

  // Fetch details for individual Pokémon
  const getPokemonDetailsListByUrl = async (results) => {
    const pokemonsDetailsList = await Promise.all(
      results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        return await response.json(); // Await the JSON
      })
    );
    return pokemonsDetailsList;
  };

  // Fetch paginated Pokémon data
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

      // Dispatch the list to update state
      dispatch({
        type: ACTIONS.SET_POKEMON_LIST,
        payload: pokemonsList,
      });
    } catch (error) {
      console.error("Failed to fetch Pokémon data:", error);
    } finally {
      setLoadMoreDataInprogress(false);
    }
  };

  // Fetch full list of Pokémon names/URLs (e.g., for search)
  const getAllPokemonDataList = async () => {
    try {
      const resp = await fetch(allPokemonURL);
      const { results } = await resp.json();

      dispatch({
        type: ACTIONS.SET_ALL_POKEMON_LIST,
        payload: results,
      });
    } catch (error) {
      console.error("Failed to fetch all Pokémon list:", error);
    }
  };

  // Initial data load
  useEffect(() => {
    const initializeData = async () => {
      setAppLoading(true);
      await getPokemonData(); // Load first batch
      await getAllPokemonDataList(); // Load full list
      setAppLoading(false);
    };

    initializeData();
  }, []);
  // @ts-ignore
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
