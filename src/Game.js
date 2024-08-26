import { Board } from "./Board";

import styles from "./Game.module.css";

import { BOARD_SIZE } from "./constants";

export const Game = () => (
  <div className={styles.game}>
    <div className={styles.gameBoard}>
      <Board height={BOARD_SIZE.height} width={BOARD_SIZE.width} />
    </div>
    <div className={styles.gameInfo}>
      <div></div>
    </div>
  </div>
);
