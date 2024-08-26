import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Board } from "./Board";

import "./index.css";

const Game = () => (
  <div className="game">
    <div className="game-board">
      <Board height={3} width={5} />
    </div>
    <div className="game-info">
      <div></div>
    </div>
  </div>
);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Game />
  </StrictMode>
);
