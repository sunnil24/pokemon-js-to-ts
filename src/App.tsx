import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "rsuite/dist/rsuite.min.css";
import "rsuite/styles/index.less";
import "./App.css";
import { ROUTES } from "./constants/routepaths";
import { PokemonProvider } from "./context/pokemonContext/pokemon.provider";

const HomePage = React.lazy(() => import("./pages/home/home.page"));
const DetailPage = React.lazy(() => import("./pages/details/details.page"));

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
              path={ROUTES.DETAILS}
              element={
                <Suspense fallback={<div>Loading</div>}>
                  <DetailPage />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </PokemonProvider>
    </main>
  );
};

export default App;
