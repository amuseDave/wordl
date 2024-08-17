import { useSelector, useDispatch } from "react-redux";
import submitImg from "../assets/submit.png";
import { wordlActions } from "../store/wordlSlicer";
import { uiActions } from "../store/uiSlicer";
import { useRef } from "react";
import "./Keyboard.css";

export default function Keyboard() {
  const dispatch = useDispatch();
  const wordl = useSelector((state) => state.wordlSlicer);
  const words = useSelector((state) => state.wordsSlicer.words);
  const keyboardRows = useSelector((state) => state.wordlSlicer.keyboard);
  const timeoutRef = useRef();

  function handleButtonPress(button) {
    if (button === "delete") {
      dispatch(wordlActions.deleteWordLetter());
    }
    if (button === "submit") {
      if (!wordl.correctWord) return;

      const guessedWord = wordl.container[wordl.activeColumn]
        .map((box) => box.letter)
        .join("");

      //Compare length to set animation on empty letter
      if (wordl.correctWord.length !== guessedWord.length) {
        dispatch(uiActions.setWrongWord(null));
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          dispatch(uiActions.clearWrongWord());
        }, 1300);
        return;
      }
      // dispatch(submitWordThunk(guessedWord));

      //Check if the word exists and animate red if it doesn't
      const indexOfWord = words.findIndex(
        (word) => guessedWord.toLowerCase() === word
      );
      const indexOfWord2 = wordl.guessedWords.findIndex(
        (word) => word === guessedWord
      );
      if (indexOfWord === -1 || indexOfWord2 !== -1) {
        dispatch(uiActions.setWrongWord(true));

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          dispatch(uiActions.clearWrongWord());
        }, 1000);
        return;
      }

      //Check if it's correct word
      if (wordl.correctWord === guessedWord) {
        dispatch(wordlActions.enableWin());
      } else {
        dispatch(wordlActions.submitWord(guessedWord));
      }
    }

    if (/^[a-zA-Z]$/.test(button)) {
      dispatch(wordlActions.typeWord(button));
    }
  }

  return (
    <div className="keyboard">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="row-keyboard">
          {row.map((button, i) => (
            <button
              onClick={() => {
                handleButtonPress(button.key.toLowerCase());
              }}
              key={i}
              className={`${
                button.key === "Delete"
                  ? "special-key"
                  : button.key === "Submit"
                  ? "special-key"
                  : "key"
              } ${
                button.state === undefined
                  ? "undefined-key"
                  : button.state === false
                  ? "wrong-key"
                  : button.state
                  ? "correct-key"
                  : ""
              }`}
            >
              {button.key === "Delete" ? (
                <svg
                  width="20"
                  height="20"
                  aria-hidden="true"
                  class="game-icon"
                  data-testid="icon-backspace"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="var(--color-tone-1)"
                    d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H7.07L2.4 12l4.66-7H22zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
                  ></path>
                </svg>
              ) : button.key === "Submit" ? (
                <img className="submit-img" src={submitImg}></img>
              ) : (
                button.key
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
