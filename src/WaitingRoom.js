import { usePresenceListener, useAbly } from "ably/react";

import styles from "./WaitingRoom.module.css";

export const WaitingRoom = ({ name, handleInitiateGame }) => {
  const client = useAbly();
  const { presenceData } = usePresenceListener("players");

  const availablePlayers = presenceData.filter(
    (player) =>
      player.data &&
      player.data.status === "waiting" &&
      player.clientId !== client.auth.clientId
  );

  return (
    <div className={styles.waitingRoom}>
      <div>Welcome, {name}!</div>
      {availablePlayers.length ? (
        <>
          <div className={styles.header}>Other available players:</div>
          <div className={styles.players}>
            {availablePlayers.map((player) => (
              <div key={player.clientId} className={styles.player}>
                <button onClick={() => handleInitiateGame(player.clientId)}>
                  {player.data.name}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.header}>Waiting for other players...</div>
      )}
    </div>
  );
};
