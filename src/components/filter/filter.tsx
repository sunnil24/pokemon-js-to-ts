import { useContext, useEffect, useState } from "react";
import { Col, Row } from "rsuite";
import { debounceTime, distinctUntilChanged, map, Observable, of } from "rxjs";
import { baseURL, SEARCH_SLICED } from "../../constants/apiUrls";
import { getCamleCaseString } from "../../constants/pokemon.types";
import * as ACTIONS from "../../store/actions/pokemonAction";

import PokemonContext, {
  Pokemon,
  PokemonContextType,
  PokemonGender,
  PokemonType,
} from "../../context/pokemonContext/pokemon.context986348923";
import {
  getAllParallelCall,
  getPokemonGenders,
  getPokemonTypes,
  removeDuplicateBy,
} from "../../services/common.service";
import "./filter.scss";
import AppMultiSelectDropDown from "./multiSelectdropDown/multiSelectdropDown";
import SearchFilter from "./search/search.filter";

interface AppFilterProps {
  isFilterEnable: (enabled: boolean) => void;
}

interface DropdownOption {
  label: string;
  value: string;
  url: string;
}

type SearchChangeHandler = (value: string, event: React.FormEvent) => void;
type DropdownChangeHandler = (value: string[], event: React.FormEvent) => void;

const AppFilter: React.FC<AppFilterProps> = (props) => {
  const {
    state,
    getPokemonData,
    dispatch,
    setAppLoading,
    getPokemonDetailsListByUrl,
  } = useContext<PokemonContextType>(PokemonContext);

  const { allPokemonsList, pokemonTypes, pokemonGenders } = state;

  const [isOpenTypeFilter, setIsOpenTypeFilter] = useState(false);
  const [isOpenGendreFilter, setIsOpenGendreFilter] = useState(false);

  let data$: Observable<Pokemon[]> = of([]);

  const onOpenTypeHandler = () => setIsOpenTypeFilter(true);
  const onCloseTypeHandler = () => setIsOpenTypeFilter(false);
  const onOpenGenderHandler = () => setIsOpenGendreFilter(true);
  const onCloseGenderHandler = () => setIsOpenGendreFilter(false);

  const onCleanTypeHandler = (event?: unknown) => {
    if (event) {
      props.isFilterEnable(false);
    }
  };

  const onSearchChangeHandler: SearchChangeHandler = (value, event) => {
    event.preventDefault();
    value = value.trim();
    setAppLoading(true);

    if (value.length) {
      props.isFilterEnable(true);
      data$ = of(allPokemonsList).pipe(
        debounceTime(4000),
        distinctUntilChanged(),
        map((pokemons) =>
          pokemons.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
          )
        )
      );
    } else {
      filterPokemonData([]);
      getPokemonData(true);
      props.isFilterEnable(false);
    }

    data$.subscribe((pokemanList) => {
      if (pokemanList.length > SEARCH_SLICED) {
        pokemanList = pokemanList.slice(0, SEARCH_SLICED);
      }
      getPokemonDetailsListByUrl(
        pokemanList.map((p) => baseURL + "/pokemon/" + p.name)
      ).then((res) => {
        filterPokemonData(res);
      });
    });

    setAppLoading(false);
  };

  const onTypeChangeHandler: DropdownChangeHandler = (value, event) => {
    event.preventDefault();
    if (value.length) {
      props.isFilterEnable(true);
      getAllParallelCall(value)
        .then((pokemonList: any[]) => {
          pokemonList = pokemonList.map((res) => res.pokemon);
          pokemonList = pokemonList.flat().map((res) => res.pokemon);
          pokemonList = removeDuplicateBy(pokemonList, "name");
          if (pokemonList.length > SEARCH_SLICED) {
            pokemonList = pokemonList.slice(-SEARCH_SLICED);
          }
          getPokemonDetailsListByUrl(pokemonList).then((res) => {
            filterPokemonData(res);
          });
        })
        .catch((err) => Error(err));
    } else {
      filterPokemonData([]);
      getPokemonData(true);
      props.isFilterEnable(false);
    }
  };

  const onGenderChangeHandler: DropdownChangeHandler = (value, event) => {
    event.preventDefault();
    if (value.length) {
      props.isFilterEnable(true);
      getAllParallelCall(value)
        .then((pokemonList: any[]) => {
          pokemonList = pokemonList
            .map((res) => res.pokemon_species_details)
            .flat();
          pokemonList = pokemonList.map(
            (res) =>
              baseURL +
              "/pokemon" +
              res.pokemon_species.url.split("pokemon-species")[1]
          );
          pokemonList = Array.from(new Set(pokemonList));
          if (pokemonList.length > SEARCH_SLICED) {
            pokemonList = [
              ...pokemonList.slice(0, SEARCH_SLICED),
              ...pokemonList.slice(-SEARCH_SLICED),
            ];
          }
          const urlList = pokemonList;
          getPokemonDetailsListByUrl(urlList).then((res) => {
            filterPokemonData(res);
          });
        })
        .catch((err) => Error(err));
    } else {
      filterPokemonData([]);
      getPokemonData(true);
      props.isFilterEnable(false);
    }
  };

  const filterPokemonData = (data: Pokemon[]) => {
    dispatch({
      type: ACTIONS.SET_FILTERED_POKEMON_LIST,
      payload: data,
    });
  };

  const setPokemonTypes = (data: PokemonType[]) => {
    if (data.length) {
      const formatted: DropdownOption[] = data.map((item) => ({
        label: getCamleCaseString(item.name),
        value: item.url,
        url: item.url,
      }));
      dispatch({
        type: ACTIONS.SET_POKEMON_TYPE,
        payload: formatted,
      });
    } else {
      dispatch({
        type: ACTIONS.SET_POKEMON_TYPE,
        payload: [],
      });
    }
  };

  const setPokemonGendersList = (genderList: PokemonGender[]) => {
    const formatted: DropdownOption[] = genderList.map((item) => ({
      label: getCamleCaseString(item.name),
      value: item.url,
      url: item.url,
    }));
    if (formatted.length) {
      dispatch({
        type: ACTIONS.SET_POKEMON_GENDER_LIST,
        payload: formatted,
      });
    } else {
      dispatch({
        type: ACTIONS.SET_POKEMON_GENDER_LIST,
        payload: [],
      });
    }
  };

  const getAllPokemonType = async () => {
    getPokemonTypes()
      .then((res) => {
        setPokemonTypes(res.results);
      })
      .catch((err) => new Error(err));
  };

  const getPokemonGendersList = async () => {
    getPokemonGenders()
      .then((res) => {
        setPokemonGendersList(res.results);
      })
      .catch((err) => new Error(err));
  };

  useEffect(() => {
    getAllPokemonType();
    getPokemonGendersList();
  }, []);

  return (
    <div className="filter-container">
      <div className="filter-wrap">
        <Row className="filter-row-wrap show-grid">
          <Col lg={16} xl={16} xs={24} sm={24}>
            <div>
              <SearchFilter
                placeholder="Name or Number"
                inputClass="pokemon-search-filter"
                label="Search By"
                onChangeHandler={onSearchChangeHandler}
              />
            </div>
          </Col>
          <Col lg={4} xl={4} xs={24} sm={24}>
            <div>
              <AppMultiSelectDropDown
                placeholder="Select Types"
                isOpen={isOpenTypeFilter}
                data={pokemonTypes}
                label="Type"
                onChangeHandler={onTypeChangeHandler}
                onOpenHandler={onOpenTypeHandler}
                onCloseHandler={onCloseTypeHandler}
                onCleanHandler={onCleanTypeHandler}
              />
            </div>
          </Col>
          <Col lg={4} xl={4} xs={24} sm={24}>
            <div>
              <AppMultiSelectDropDown
                placeholder="Select Gender"
                isOpen={isOpenGendreFilter}
                data={pokemonGenders}
                label="Gender"
                onChangeHandler={onGenderChangeHandler}
                onOpenHandler={onOpenGenderHandler}
                onCloseHandler={onCloseGenderHandler}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AppFilter;
