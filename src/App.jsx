import React, { useState } from "react";

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("X");
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    draws: 0,
  });
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);

  const checkWinner = (currentBoard) => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;

      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return combination;
      }
    }

    return null;
  };

  const handleCellClick = (index) => {
    if (board[index] || winner) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = turn;

    const winningCombination = checkWinner(newBoard);

    if (winningCombination) {
      setBoard(newBoard);
      setWinner(turn);
      setWinningCells(winningCombination);
      setScores((previous) => ({
        ...previous,
        [turn]: previous[turn] + 1,
      }));
      return;
    }

    if (newBoard.every((cell) => cell !== "")) {
      setBoard(newBoard);
      setWinner("Draw");
      setScores((previous) => ({
        ...previous,
        draws: previous.draws + 1,
      }));
      return;
    }

    setBoard(newBoard);
    setTurn(turn === "X" ? "O" : "X");
  };

  const restartRound = () => {
    setBoard(Array(9).fill(""));
    setTurn("X");
    setWinner(null);
    setWinningCells([]);
  };

  const resetAll = () => {
    restartRound();
    setScores({
      X: 0,
      O: 0,
      draws: 0,
    });
  };

  return (
    <div className="page">
      <div className="game-card">
        <h1>Tic-Tac-Toe</h1>

        <div className="scores">
          <span className="score x-score">X: {scores.X}</span>
          <span className="score">Draws: {scores.draws}</span>
          <span className="score o-score">O: {scores.O}</span>
        </div>

        <div className="turn">
          {winner === "Draw" ? "Draw!" : winner ? `Winner: ${winner}` : `Turn: ${turn}`}
        </div>

        <div className="board">
          {board.map((cell, index) => (
            <button
              key={index}
              className={`cell ${
                winningCells.includes(index) ? "winning-cell" : ""
              }`}
              onClick={() => handleCellClick(index)}
              aria-label={`Cell ${index + 1}`}
            >
              {cell.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="actions">
          <button className="primary-button" onClick={restartRound}>
            {winner ? "Play Again" : "Restart Round"}
          </button>

          <button className="secondary-button" onClick={resetAll}>
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
