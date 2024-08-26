import { useState } from "react";

import { Box } from "./Box";

export const Board = ({ height, width }) => {
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

  const gameStatus = () => {
    if (scores["A"] + scores["B"] < boxes.length * boxes[0].length) {
      return `Current Player: ${currentPlayer}`;
    } else if (scores["A"] > scores["B"]) {
      return "Game Over. Winner: Player A!";
    } else if (scores["B"] > scores["A"]) {
      return "Game Over. Winner: Player B!";
    } else {
      return "Game Over. Tie Game";
    }
  };

  const checkWinner = (box) => {
    // Check if current player won the current box
    if (box.top && box.bottom && box.left && box.right) {
      setScores((scores) => ({
        ...scores,
        [currentPlayer]: scores[currentPlayer] + 1,
      }));
    }
    // Check for game over
    if (scores["A"] + scores["B"] >= boxes.length * boxes[0].length) {
      setCurrentPlayer("");
    }

    if (box.top && box.bottom && box.left && box.right) {
      return currentPlayer;
    } else {
      return "";
    }
  };

  const handleClick = (e, i, j) => {
    // First, get coordinates of click relative to box
    let x = e.clientX - e.target.getBoundingClientRect().left;
    let y = e.clientY - e.target.getBoundingClientRect().top;

    // Clone boxes state
    let newBoxes = [];

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
        setCurrentPlayer("B");
      } else {
        setCurrentPlayer("A");
      }
    }

    // Update state
    setBoxes(newBoxes);
  };

  return (
    <div className="board">
      <div className="status">
        {gameStatus()}
        <br />
        <br />
        Player A: {scores["A"]}
        <br />
        Player B: {scores["B"]}
      </div>

      {boxes.map((row, i) => (
        <div className="row" key={`row-${i}`}>
          {row.map((box, j) => (
            <Box
              key={`${i}-${j}`}
              winner={box.winner}
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
