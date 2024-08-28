import { useState, useEffect } from "react";
import { useChannel, useAbly } from "ably/react";

import { Box } from "./Box";

import styles from "./Board.module.css";

export const Board = ({
  name,
  opponentName,
  opponentId,
  height,
  width,
  isInitiator,
}) => {
  const client = useAbly();
  const filter = isInitiator
    ? `${client.auth.clientId}:${opponentId}`
    : `${opponentId}:${client.auth.clientId}`;
  const { publish } = useChannel("games", filter, (message) => {
    console.log(message);
    if (message.clientId === client.auth.clientId) {
      return;
    }
    if (message.data.action === "update-game") {
      setBoxes(message.data.boxes);
      setCurrentPlayer(message.data.currentPlayer);
    }
    if (message.data.action === "update-scores") {
      setScores(message.data.scores);
    }
    if (message.data.action === "game-over") {
      setCurrentPlayer("");
      setScores(message.data.scores);
    }
  });

  const [currentPlayer, setCurrentPlayer] = useState("A");
  const [scores, setScores] = useState({ A: 0, B: 0 });
  const [boxes, setBoxes] = useState(
    Array(height).fill(
      Array(width).fill({
        top: null,
        left: null,
        right: null,
        bottom: null,
        winner: "",
      })
    )
  );

  useEffect(() => {
    if (isInitiator) {
      publish(filter, { action: "game-start", name, opponentName });
    }
  }, [isInitiator, publish, filter, name, opponentName]);

  const gameStatus = () => {
    if (scores["A"] + scores["B"] < boxes.length * boxes[0].length) {
      return `Current Player: ${
        (currentPlayer === "A") === isInitiator ? name : opponentName
      }`;
    } else if (scores["A"] > scores["B"]) {
      return `Game Over. Winner: ${isInitiator ? name : opponentName}!`;
    } else if (scores["B"] > scores["A"]) {
      return `Game Over. Winner: ${isInitiator ? opponentName : name}!`;
    } else {
      return "Game Over. Tie Game";
    }
  };

  const checkWinner = (box) => {
    let newScores = { ...scores };
    // Check if current player won the current box
    if (box.top && box.bottom && box.left && box.right) {
      newScores = {
        ...scores,
        [currentPlayer]: scores[currentPlayer] + 1,
      };
      setScores(newScores);
      publish(filter, { action: "update-scores", scores: newScores });
    }
    // Check for game over
    if (newScores["A"] + newScores["B"] >= boxes.length * boxes[0].length) {
      setCurrentPlayer("");
      publish(filter, { action: "game-over", scores: newScores });
    }

    if (box.top && box.bottom && box.left && box.right) {
      return currentPlayer;
    } else {
      return "";
    }
  };

  const handleClick = (e, i, j) => {
    // Check if it's the player's turn
    if ((currentPlayer === "B") === isInitiator) {
      return;
    }

    // First, get coordinates of click relative to box
    let x = e.clientX - e.target.getBoundingClientRect().left;
    let y = e.clientY - e.target.getBoundingClientRect().top;

    // Clone boxes state
    let newBoxes = [];
    let newCurrentPlayer = currentPlayer;

    for (let k = 0; k < boxes.length; k++) {
      newBoxes[k] = [];
      for (let l = 0; l < boxes[k].length; l++) {
        newBoxes[k][l] = { ...boxes[k][l] };
      }
    }

    let winnerFlag = false,
      turnFlag = false;

    if (y < 10) {
      if (!newBoxes[i][j].top) {
        newBoxes[i][j].top = currentPlayer;
        turnFlag = true;
        if (i > 0) {
          newBoxes[i - 1][j].bottom = currentPlayer;
          newBoxes[i - 1][j].winner = checkWinner(newBoxes[i - 1][j]);
          if (newBoxes[i - 1][j].winner) winnerFlag = true;
        }
      }
    } else if (y > 40) {
      if (!newBoxes[i][j].bottom) {
        newBoxes[i][j].bottom = currentPlayer;
        turnFlag = true;
        if (i < newBoxes.length - 1) {
          newBoxes[i + 1][j].top = currentPlayer;
          newBoxes[i + 1][j].winner = checkWinner(newBoxes[i + 1][j]);
          if (newBoxes[i + 1][j].winner) winnerFlag = true;
        }
      }
    } else if (x < 10) {
      if (!newBoxes[i][j].left) {
        newBoxes[i][j].left = currentPlayer;
        turnFlag = true;
        if (j > 0) {
          newBoxes[i][j - 1].right = currentPlayer;
          newBoxes[i][j - 1].winner = checkWinner(newBoxes[i][j - 1]);
          if (newBoxes[i][j - 1].winner) winnerFlag = true;
        }
      }
    } else if (x > 40) {
      if (!newBoxes[i][j].right) {
        newBoxes[i][j].right = currentPlayer;
        turnFlag = true;
        if (j < newBoxes[i].length - 1) {
          newBoxes[i][j + 1].left = currentPlayer;
          newBoxes[i][j + 1].winner = checkWinner(newBoxes[i][j + 1]);
          if (newBoxes[i][j + 1].winner) winnerFlag = true;
        }
      }
    }

    // Check if current box is winner
    if (!newBoxes[i][j].winner) {
      newBoxes[i][j].winner = checkWinner(newBoxes[i][j]);
      if (newBoxes[i][j].winner) winnerFlag = true;
    }

    // Update current player

    if (turnFlag && !winnerFlag) {
      if (currentPlayer === "A") {
        newCurrentPlayer = "B";
      } else {
        newCurrentPlayer = "A";
      }
    }

    // Update state
    setBoxes(newBoxes);
    setCurrentPlayer(newCurrentPlayer);

    // Publish state
    publish(filter, {
      action: "update-game",
      boxes: newBoxes,
      currentPlayer: newCurrentPlayer,
    });
  };

  return (
    <div className={styles.board}>
      <div className={styles.status}>
        {gameStatus()}
        <br />
        <br />
        {isInitiator ? name : opponentName}: {scores["A"]}
        <br />
        {isInitiator ? opponentName : name}: {scores["B"]}
      </div>

      {boxes.map((row, i) => (
        <div className={styles.row} key={`row-${i}`}>
          {row.map((box, j) => (
            <Box
              key={`${i}-${j}`}
              winner={box.winner}
              winnerLabel={((box.winner === "A") === isInitiator
                ? name
                : opponentName
              )
                .charAt(0)
                .toUpperCase()}
              top={box.top}
              bottom={box.bottom}
              left={box.left}
              right={box.right}
              i={i}
              j={j}
              onClick={(e) => handleClick(e, i, j)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
