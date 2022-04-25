import { useEffect, useState } from "react";
import classes from "./App.module.css";
import "./App.css";
import Backdrop from "./components/Backdrop";
import Overlay from "./components/Overlay";

const words = require("./words.json");
const defaultGrid = require("./grid.json");

export default function App() {
  const [randomWord, setRandomWord] = useState([]);
  const [enteredWord, setEnteredWord] = useState("");

  const [isPlaying, setIsPlaying] = useState(true);

  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedTile, setSelectedTile] = useState(0);

  const [overlayIsOpened, setOverlayIsOpened] = useState(false);

  const [grid, setGrid] = useState(defaultGrid);

  const gridItems = grid.map((row, index) => (
    <div key={index} className={classes.row}>
      {row.map((cell, index) => (
        <span key={index} className={classes[cell.state]}>
          {cell.tile}
        </span>
      ))}
    </div>
  ));

  useEffect(() => {
    setRandomWord(words[Math.floor(Math.random() * words.length)]);
  }, []);

  useEffect(() => {
    function isLetter(str) {
      return str.length === 1 && str.match("[a-zA-Z]");
    }

    async function downHandler({ key }) {
      console.log(randomWord);
      if (isPlaying === true) {
        key = key.toLowerCase();
        if (isLetter(key) !== false && isLetter(key) !== null) {
          await updateTile(selectedRow, selectedTile, "tile", key);
          if (selectedTile !== 5) {
            setSelectedTile(selectedTile + 1);
          }
        } else if (key === "backspace") {
          await updateTile(selectedRow, selectedTile - 1, "tile", "");
          if (selectedTile !== 0) {
            setSelectedTile(selectedTile - 1);
          }
        } else if (
          key === "enter" &&
          grid[selectedRow][4].tile !== "" &&
          selectedRow !== 6
        ) {
          let newEnteredWord = "";
          for (let letter in grid[selectedRow]) {
            newEnteredWord += grid[selectedRow][letter].tile;
          }
          setEnteredWord(newEnteredWord);
          if (words.includes(newEnteredWord)) {
            for (let i = 0; i < grid[selectedRow].length; i++) {
              setGrid((prevGrid) => {
                const temp = [...prevGrid];
                temp[selectedRow][i].state = "grey";
                return temp;
              });
              if (randomWord.includes(grid[selectedRow][i].tile)) {
                setGrid((prevGrid) => {
                  const temp = [...prevGrid];
                  temp[selectedRow][i].state = "yellow";
                  return temp;
                });
              }
              if (grid[selectedRow][i].tile === randomWord.charAt(i)) {
                setGrid((prevGrid) => {
                  const temp = [...prevGrid];
                  temp[selectedRow][i].state = "green";
                  return temp;
                });
              }
            }
            if (newEnteredWord === randomWord) {
              setIsPlaying(false);
              setOverlayIsOpened(true);
            } else if (selectedRow !== 5) {
              setSelectedRow(selectedRow + 1);
              setSelectedTile(0);
            } else {
              setIsPlaying(false);
              setOverlayIsOpened(true);
            }
          } else {
            alert("Not in word list");
          }
        }
      }
    }

    const upHandler = () => {};

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };

    async function updateTile(row, tile, key, value) {
      setGrid((val) =>
        val.map((rowData, rowIdx) =>
          rowIdx === row
            ? rowData.map((r, tileIdx) =>
                tileIdx === tile ? { ...r, [key]: value } : r
              )
            : rowData
        )
      );
    }
  }, [
    gridItems,
    grid,
    selectedRow,
    selectedTile,
    randomWord,
    isPlaying,
    enteredWord,
  ]);

  function closeOverlay() {
    setOverlayIsOpened(false);
  }

  function restart() {
    setGrid(defaultGrid);
    setRandomWord(words[Math.floor(Math.random() * words.length)]);
    setEnteredWord("");
    setIsPlaying(true);
    setSelectedRow(0);
    setSelectedTile(0);
    setOverlayIsOpened(false);
  }

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.grid}>{gridItems}</div>
      </div>
      {overlayIsOpened === true ? <Backdrop onClose={closeOverlay} /> : null}
      {overlayIsOpened === true ? (
        <Overlay
          restart={restart}
          randomWord={randomWord}
          word={enteredWord}
          onClose={closeOverlay}
        />
      ) : null}
    </div>
  );
}
