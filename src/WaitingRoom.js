import styles from "./WaitingRoom.module.css";

export const WaitingRoom = ({ name }) => (
  <div className={styles.waitingRoom}>Welcome, {name}!</div>
);
