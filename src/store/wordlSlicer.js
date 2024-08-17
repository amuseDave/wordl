import { createSlice } from "@reduxjs/toolkit";
// import { uiActions } from "./uiSlicer";
import { wordsActions } from "./wordsSlicer";

const initialState = {
  container: [[], [], [], [], [], []],
  activeColumn: 0,
  activeRow: 0,
  isGuessed: false,
  correctWord: null,
  correctWordCopy: null,
  isWinner: null,
  guessedWords: [],
};

const wordlSlicer = createSlice({
  name: "wordl",
  initialState,
  reducers: {
    setWord(state, action) {
      state.correctWord = action.payload;
      state.correctWordCopy = action.payload;
    },
    typeWord(state, action) {
      if (state.correctWord === null) return;
      state.container[state.activeColumn][state.activeRow].letter =
        action.payload;
      if (state.activeRow + 1 === state.container[state.activeColumn].length) {
        return;
      } else {
        state.activeRow++;
      }
    },
    setWordl(state, actions) {
      state.container = actions.payload.container;
      state.activeColumn = actions.payload.activeColumn;
      state.activeRow = actions.payload.activeRow;
      state.isGuessed = actions.payload.isGuessed;
      state.isWinner = actions.payload.isWinner;
      state.correctWord = actions.payload.correctWord;
      state.correctWordCopy = actions.payload.correctWordCopy;
      state.guessedWords = actions.payload.guessedWords;
    },
    resetGame(state) {
      state.isGuessed = false;
      state.activeRow = 0;
      state.guessedWords = [];
      state.isWinner = null;
      state.activeColumn = 0;
      state.container.forEach((row) => {
        row.forEach((box) => {
          box.isCorrect = null;
          box.letter = "";
        });
      });
    },
    setContainer(state, action) {
      state.container.forEach((row) => {
        action.payload.split("").forEach((letter) => {
          row.push({ isCorrect: null, letter: "" });
        });
      });
    },
    deleteWordLetter(state) {
      if (state.container[state.activeColumn][state.activeRow].letter !== "") {
        state.container[state.activeColumn][state.activeRow].letter = "";
      } else {
        if (state.activeRow === 0) return;
        state.activeRow--;
        state.container[state.activeColumn][state.activeRow].letter = "";
      }
    },
    submitWord(state, action) {
      const correctWordLettersArrayCopy = state.correctWordCopy.split("");
      state.guessedWords.push(action.payload);

      state.container[state.activeColumn].forEach((box, index) => {
        const letter = box.letter;

        if (letter === state.correctWord.at(index)) {
          box.isCorrect = true;
          correctWordLettersArrayCopy[index] = "";
        }
      });

      state.container[state.activeColumn].forEach((box) => {
        const letter = box.letter;
        if (correctWordLettersArrayCopy.includes(letter)) {
          box.isCorrect = undefined;
          correctWordLettersArrayCopy[
            correctWordLettersArrayCopy.indexOf(letter)
          ] = "";
        } else if (box.isCorrect !== true) {
          box.isCorrect = false;
        }
      });

      state.activeColumn++;
      state.activeRow = 0;

      if (state.activeColumn === state.container.length) {
        state.isWinner = false;
        state.isGuessed = true;
      }
    },
    enableWin(state) {
      state.isGuessed = true;
      state.isWinner = true;
      state.container[state.activeColumn].forEach(
        (box) => (box.isCorrect = true)
      );
      if (state.activeColumn === 0) state.activeColumn = 1;
    },
  },
});

export default wordlSlicer.reducer;
export const wordlActions = wordlSlicer.actions;

export function wordlRandomWordThunk() {
  return async (dispatch) => {
    const response = await fetch(
      "https://random-word-api.herokuapp.com/word?length=5&number=10000"
    );
    const resData = await response.json();
    const randomWord = resData[Math.floor(Math.random() * resData.length)];
    dispatch(wordsActions.setWords(resData));
    dispatch(wordlActions.setContainer(randomWord));
    dispatch(wordlActions.setWord(randomWord));
  };
}

export function resetGameThunk(wordsData) {
  return (dispatch) => {
    const randomWord = wordsData[Math.floor(Math.random() * wordsData.length)];

    dispatch(wordlActions.resetGame());
    dispatch(wordlActions.setWord("spout"));
  };
}

export function getWordlStateThunk(wordl, words) {
  return (dispatch) => {
    dispatch(wordsActions.setWords(words));
    dispatch(wordlActions.setWordl(wordl));
  };
}

export function submitWordThunk(guessedWord) {
  return async (dispatch) => {
    // const response = await fetch(
    //   "https://api.dictionaryapi.dev/api/v2/entries/en/" + guessedWord
    // );
    // const resData = await response.json();
    // console.log(resData);
    // if (!response.ok) {
    //   dispatch(uiActions.setWrongWord());
    // } else {
    // }
  };
}
