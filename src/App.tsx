import React, { Suspense, useState } from "react";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import "rsuite/dist/rsuite.min.css";
import "rsuite/styles/index.less";
import "./App.css";
import { ROUTES } from "./constants/routepaths";
import { PokemonProvider } from "./context/pokemonContext/pokemon.provider";

const HomePage = React.lazy(() => import("./pages/home/home.page"));
const DetailPage = React.lazy(() => import("./pages/details/details.page"));

// Wrapper component to handle DetailPage props
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

const App = () => {
  return (
    <main>
      <PokemonProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path={ROUTES.HOME}
              element={
                <Suspense fallback={<div>Loading</div>}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route
              path={`${ROUTES.DETAILS}/:pokemonId`}
              element={
                <Suspense fallback={<div>Loading</div>}>
                  <DetailPageWrapper />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </PokemonProvider>
    </main>
  );
};

export default React.memo(App); // Memoizing to prevent unnecessary re-renders
