import { useSelector, useDispatch } from "react-redux";
import { wordlActions } from "../store/wordlSlicer";
import { uiActions } from "../store/uiSlicer";
import { useEffect, useRef } from "react";
import { resetGameThunk } from "../store/wordlSlicer";
// import { submitWordThunk } from "../store/wordlSlicer";

export default function WordlGame() {
  const timeoutRef = useRef(null);
  const buttonRef = useRef();

  const wordl = useSelector((state) => state.wordlSlicer);
  const isWrongWord = useSelector((state) => state.uiSlicer.isWrongWord);
  const words = useSelector((state) => state.wordsSlicer.words);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wordl.correctWord && words) {
      localStorage.setItem("wordl", JSON.stringify(wordl));
      localStorage.setItem("words", JSON.stringify(words));
    }
  }, [wordl, words]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Backspace") {
        dispatch(wordlActions.deleteWordLetter());
      }
      if (e.key === "Enter") {
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

      if (/^[a-zA-Z]$/.test(e.key)) {
        dispatch(wordlActions.typeWord(e.key));
      }
    }
    if (!wordl.isGuessed) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [wordl.correctWord, wordl.container[wordl.activeColumn], wordl.isGuessed]);

  function handleResetGame() {
    dispatch(resetGameThunk(words));
    buttonRef.current.blur();
  }

  return (
    <div className="wordl-container">
      {wordl.container.map((row, index) => {
        return (
          <div key={index} className={`wordl-row`}>
            {row.map((box, i) => (
              <div
                key={i}
                className={`wordl-row-box ${
                  isWrongWord === null &&
                  box.letter === "" &&
                  index === wordl.activeColumn
                    ? "empty-letter-box"
                    : null
                } ${
                  isWrongWord && index === wordl.activeColumn ? "wrong" : null
                } ${
                  box.isCorrect === undefined
                    ? "undefined-letter-box"
                    : box.isCorrect
                    ? "correct-letter-box"
                    : box.isCorrect === false
                    ? "wrong-letter-box"
                    : null
                }`}
              >
                {box.letter}
              </div>
            ))}
          </div>
        );
      })}
      <button
        ref={buttonRef}
        disabled={wordl.activeColumn === 0}
        onClick={handleResetGame}
        className="reset-wordl"
      >
        Reset Game
      </button>
    </div>
  );
}
