import { Game } from "./Game";

import styles from "./App.module.css";

export const App = () => (
  <>
    <div className={styles.title}>dots &amp; boxes</div>
    <Game />
    <div className={styles.bottomLeft}>
      <a href="https://en.wikipedia.org/wiki/Dots_and_Boxes">About</a>
    </div>
    <div className={styles.bottomRight}>
      <a href="https://github.com/jessefischer/dots-and-boxes">Source</a>
    </div>
  </>
);
