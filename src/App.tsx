import { Suspense, lazy, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import "rsuite/dist/rsuite.min.css";
import "rsuite/styles/index.less";
import "./App.css";
import { ROUTES } from "./constants/routepaths";
import { PokemonProvider } from "./context/pokemonContext/pokemon.provider";

const HomePage = lazy(() => import("./pages/home/home.page"));
const DetailPage = lazy(() => import("./pages/details/details.page"));

const DetailPageWrapper: React.FC = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>();
  const [isCardSelected, setIsCardSelected] = useState(true);

  const toggleModal = () => {
    setIsCardSelected(false);
    // Navigate back to home
    window.history.back();
  };

  return (
    <DetailPage
      isCardSelected={isCardSelected}
      toggleModal={toggleModal}
      pokemonId={parseInt(pokemonId || "1", 10)}
      offset={0}
    />
  );
};

function App() {
  return (
    <main>
      <PokemonProvider>
        <Routes>
          <Route
            path={ROUTES.HOME}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path={`${ROUTES.DETAILS}/:pokemonId`}
            element={<DetailPageWrapper />}
          />
        </Routes>
      </PokemonProvider>
    </main>
  );
}

export default App;
