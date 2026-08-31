import React, { useState } from "react";

const emptyBoard = Array(81).fill("");

function App() {
  const [board, setBoard] = useState(emptyBoard);
  const [invalidCells, setInvalidCells] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (index, value) => {
    if (value === "" || /^[1-9]$/.test(value)) {
      const newBoard = [...board];
      newBoard[index] = value;
      setBoard(newBoard);
      setInvalidCells([]);
      setMessage("");
    }
  };

  const findConflicts = () => {
    const conflicts = new Set();

    const addDuplicates = (indices) => {
      const seen = {};

      indices.forEach((index) => {
        const value = board[index];

        if (!value) {
          return;
        }

        if (!seen[value]) {
          seen[value] = [];
        }

        seen[value].push(index);
      });

      Object.values(seen).forEach((indexes) => {
        if (indexes.length > 1) {
          indexes.forEach((index) => conflicts.add(index));
        }
      });
    };

    // Check rows
    for (let row = 0; row < 9; row += 1) {
      const indices = [];

      for (let col = 0; col < 9; col += 1) {
        indices.push(row * 9 + col);
      }

      addDuplicates(indices);
    }

    // Check columns
    for (let col = 0; col < 9; col += 1) {
      const indices = [];

      for (let row = 0; row < 9; row += 1) {
        indices.push(row * 9 + col);
      }

      addDuplicates(indices);
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow += 1) {
      for (let boxCol = 0; boxCol < 3; boxCol += 1) {
        const indices = [];

        for (let row = 0; row < 3; row += 1) {
          for (let col = 0; col < 3; col += 1) {
            indices.push(
              (boxRow * 3 + row) * 9 + (boxCol * 3 + col)
            );
          }
        }

        addDuplicates(indices);
      }
    }

    return Array.from(conflicts);
  };

  const handleValidate = () => {
    const conflicts = findConflicts();

    if (conflicts.length > 0) {
      setInvalidCells(conflicts);
      setMessage("❌ Invalid Sudoku! Conflicts found.");
    } else {
      setInvalidCells([]);
      setMessage("✅ Sudoku is valid so far!");
    }
  };

  const handleClear = () => {
    setBoard([...emptyBoard]);
    setInvalidCells([]);
    setMessage("");
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Sudoku Validator</h1>

        <p>Enter numbers 1-9 and validate the board.</p>

        <div className="board">
          {board.map((value, index) => (
            <input
              key={index}
              className={`cell ${
                invalidCells.includes(index) ? "invalid" : ""
              }`}
              value={value}
              maxLength={1}
              inputMode="numeric"
              onChange={(event) =>
                handleChange(index, event.target.value)
              }
              aria-label={`Cell ${index + 1}`}
            />
          ))}
        </div>

        <div className="actions">
          <button className="validate" onClick={handleValidate}>
            Validate
          </button>

          <button className="clear" onClick={handleClear}>
            Clear
          </button>
        </div>

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default App;
