import { useState } from "react";
import styles from "./Lobby.module.css";

export const Lobby = ({ handleEnter }) => {
  const [name, setName] = useState("");

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleEnter(name);
    }
  };

  return (
    <div className={styles.lobby}>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={() => handleEnter(name)}>Enter</button>
    </div>
  );
};
