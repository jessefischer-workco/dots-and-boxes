import classNames from "classnames";

import styles from "./Box.module.css";

const cx = classNames.bind(styles);

export const Box = ({
  top,
  bottom,
  left,
  right,
  winner,
  winnerLabel,
  onClick,
}) => {
  const boxClassName = cx(
    styles.box,
    top && styles["top" + top],
    bottom && styles["bottom" + bottom],
    left && styles["left" + left],
    right && styles["right" + right],
    winner && styles["winner" + winner]
  );

  return (
    <div className={boxClassName} onClick={onClick}>
      <span className={styles.winner}>{winnerLabel || "_"}</span>
      <div className={styles.topLeft}></div>
      <div className={styles.topRight}></div>
      <div className={styles.bottomLeft}></div>
      <div className={styles.bottomRight}></div>
    </div>
  );
};
