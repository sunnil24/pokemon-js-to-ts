import React, { useEffect, useState } from "react";
import { Loader, Modal } from "rsuite";
import DetailsHeader from "../../components/pokemonDetailsCard/detailsHeader/detailsHeader";
import EvolutionChainCard from "../../components/pokemonDetailsCard/evolutionChainCard/evolutionChainCard";
import PropertyCard from "../../components/pokemonDetailsCard/propertyCard/propertyCard";
import StatCard from "../../components/pokemonDetailsCard/statCard/statCard";
import {
  getPokemonDataById,
  getPokemonTypesById,
  getSpeciesDataById,
} from "../../services/common.service";
import "./details.page.scss";

interface DetailPageProps {
  isCardSelected: boolean;
  toggleModal: () => void;
  pokemonId: number;
  offset: number;
}

interface PokemonData {
  // Add more specific types as needed
  name?: string;
  id?: number;
  sprites?: {
    other?: {
      "official-artwork"?: {
        front_default?: string;
      };
    };
  };
  stats?: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  types?: Array<{
    type: {
      name: string;
    };
  }>;
}

interface PokemonSpeciesData {
  evolution_chain?: {
    url: string;
  };
  flavor_text_entries?: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
}

interface PokemonTypeData {
  damage_relations?: {
    double_damage_from?: Array<{ name: string }>;
    half_damage_from?: Array<{ name: string }>;
    no_damage_from?: Array<{ name: string }>;
  };
}

const DetailPage: React.FC<DetailPageProps> = ({
  isCardSelected,
  toggleModal,
  pokemonId,
  offset,
}) => {
  const [currentPokemonId, setCurrentPokemonId] = useState<number>(pokemonId);
  const handleClose = () => toggleModal();
  const [data, setPokemonData] = useState<PokemonData | undefined>();
  const [isDetailLoading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setCloseModal] = useState<boolean>(isCardSelected);
  const [pokemonSpeciesData, setPokemonSpeciesData] = useState<
    PokemonSpeciesData | undefined
  >();
  const [pokemonTypeData, setPokemonTypeData] = useState<
    PokemonTypeData | undefined
  >();

  useEffect(() => {
    if (!currentPokemonId) return;

    (async function setPokemonDetails() {
      setLoading(true);
      try {
        const response = await getPokemonDataById(currentPokemonId);
        setPokemonData(response);
      } catch (error) {
        console.error("Error fetching pokemon data:", error);
      } finally {
        setLoading(false);
      }
    })();

    (async function setPokemonSpecies() {
      try {
        const response = await getSpeciesDataById(currentPokemonId);
        setPokemonSpeciesData(response);
      } catch (error) {
        console.error("Error fetching species data:", error);
      }
    })();

    (async function setPokemonTypes() {
      try {
        const response = await getPokemonTypesById(currentPokemonId);
        setPokemonTypeData(response);
      } catch (error) {
        console.error("Error fetching type data:", error);
      }
    })();
  }, [currentPokemonId]);

  if (isDetailLoading || !data) {
    return (
      <Modal open={isModalOpen} onClose={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>Loading Pokemon Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader center content="loading" />
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal open={isModalOpen} onClose={handleClose} size="lg">
      <Modal.Header>
        <Modal.Title>{data.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="detail-page-container">
          <DetailsHeader data={data} />
          <PropertyCard data={data} speciesData={pokemonSpeciesData} />
          <StatCard data={data} />
          <EvolutionChainCard
            currentPokemonId={currentPokemonId}
            setCurrentPokemonId={setCurrentPokemonId}
            speciesData={pokemonSpeciesData}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DetailPage;
