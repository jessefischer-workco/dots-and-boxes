import { Lobby } from "./Lobby";
import { Game } from "./Game";
import { WaitingRoom } from "./WaitingRoom";

import styles from "./App.module.css";
import React, { useState } from "react";

export const App = () => {
  const [gameState, setGameState] = useState("lobby");
  const [name, setName] = useState("");

  return (
    <>
      <div className={styles.title}>dots &amp; boxes</div>
      {gameState === "lobby" && (
        <Lobby
          handleEnter={(name) => {
            setName(name);
            setGameState("waiting");
          }}
        />
      )}
      {gameState === "waiting" && <WaitingRoom name={name} />}
      {gameState === "playing" && <Game />}
      <div className={styles.bottomLeft}>
        <a href="https://en.wikipedia.org/wiki/Dots_and_Boxes">About</a>
      </div>
      <div className={styles.bottomRight}>
        <a href="https://github.com/jessefischer/dots-and-boxes">Source</a>
      </div>
    </>
  );
};
