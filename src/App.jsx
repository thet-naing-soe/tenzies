import { nanoid } from "nanoid";
import { useState, useRef, useEffect } from "react";
import Die from "./components/Die";
import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = useState(() => generateAllNewDice());
  const buttonRef = useRef(null);
  const gameWon =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value);
  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus();
    }
  }, [gameWon]);
  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }
  function rollDice() {
    if (!gameWon) {
      setDice((prevDice) =>
        prevDice.map((die) =>
          die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
        )
      );
    } else {
      setDice(generateAllNewDice());
    }
  }
  function hold(id) {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }
  const diceElements = dice.map((dieObj) => (
    <Die
      hold={() => hold(dieObj.id)}
      value={dieObj.value}
      key={dieObj.id}
      isHeld={dieObj.isHeld}
    />
  ));

  return (
    <main>
      {gameWon && <Confetti />}
      <div className="sr-only" aria-live="polite">
        {gameWon && (
          <p>Congratulations! You won! Press "New Game" to start again.</p>
        )}
      </div>
      <h1 className="title">Tenzies</h1>
      {gameWon ? (
        <p className="instructions">
          Congratulations! You won! Press "New Game" to start again.
        </p>
      ) : (
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
      )}
      <div className="dice-container">{diceElements}</div>
      <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
