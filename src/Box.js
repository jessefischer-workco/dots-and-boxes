import styles from "./Box.module.css";

export const Box = ({ top, bottom, left, right, winner, onClick }) => (
  <div
    className={
      styles.box +
      (top ? " " + styles["top" + top] : "") +
      (bottom ? " " + styles["bottom" + bottom] : "") +
      (left ? " " + styles["left" + left] : "") +
      (right ? " " + styles["right" + right] : "") +
      (winner ? " " + styles["winner" + winner] : "")
    }
    onClick={onClick}
  >
    <span className={styles.winner}>{winner || "_"}</span>
    <div className={styles.topLeft}></div>
    <div className={styles.topRight}></div>
    <div className={styles.bottomLeft}></div>
    <div className={styles.bottomRight}></div>
  </div>
);
