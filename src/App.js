import { useState } from "react";
import {
  usePresence,
  usePresenceListener,
  useChannel,
  useAbly,
} from "ably/react";

import { Lobby } from "./Lobby";
import { Game } from "./Game";
import { WaitingRoom } from "./WaitingRoom";

import styles from "./App.module.css";

export const App = () => {
  const client = useAbly();
  const [gameState, setGameState] = useState("lobby");
  const [name, setName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [opponentId, setOpponentId] = useState("");
  const [isInitiator, setIsInitiator] = useState(false);

  const { updateStatus } = usePresence("players");
  const { presenceData } = usePresenceListener("players");

  useChannel("games", (message) => {
    if (
      message.data.action === "game-start" &&
      gameState === "waiting" &&
      message.name.includes(client.auth.clientId)
    ) {
      setGameState("playing");
      setOpponentName(message.data.name);
      setOpponentId(message.clientId);
    }
  });

  const handleInitiateGame = (opponentId) => {
    updateStatus({ status: "playing" });
    setOpponentId(opponentId);
    setOpponentName(
      presenceData.find((player) => player.clientId === opponentId).data.name
    );
    setGameState("playing");
    setIsInitiator(true);
  };

  return (
    <>
      <div className={styles.title}>dots &amp; boxes</div>
      {gameState === "lobby" && (
        <Lobby
          handleEnter={(name) => {
            setName(name);
            updateStatus({ name, status: "waiting" });
            setGameState("waiting");
          }}
        />
      )}
      {gameState === "waiting" && (
        <WaitingRoom name={name} handleInitiateGame={handleInitiateGame} />
      )}
      {gameState === "playing" && (
        <Game
          name={name}
          opponentName={opponentName}
          opponentId={opponentId}
          isInitiator={isInitiator}
        />
      )}
      <div className={styles.bottomLeft}>
        <a href="https://en.wikipedia.org/wiki/Dots_and_Boxes">About</a>
      </div>
      <div className={styles.bottomRight}>
        <a href="https://github.com/jessefischer/dots-and-boxes">Source</a>
      </div>
    </>
  );
};
