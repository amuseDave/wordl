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
  keyboard: [
    [
      { key: "Q", state: null },
      { key: "W", state: null },
      { key: "E", state: null },
      { key: "R", state: null },
      { key: "T", state: null },
      { key: "Y", state: null },
      { key: "U", state: null },
      { key: "I", state: null },
      { key: "O", state: null },
      { key: "P", state: null },
    ],
    [
      { key: "A", state: null },
      { key: "S", state: null },
      { key: "D", state: null },
      { key: "F", state: null },
      { key: "G", state: null },
      { key: "H", state: null },
      { key: "J", state: null },
      { key: "K", state: null },
      { key: "L", state: null },
    ],
    [
      { key: "Delete", state: null },
      { key: "Z", state: null },
      { key: "X", state: null },
      { key: "C", state: null },
      { key: "V", state: null },
      { key: "B", state: null },
      { key: "N", state: null },
      { key: "M", state: null },
      { key: "Submit", state: null },
    ],
  ],
};

const wordlSlicer = createSlice({
  name: "wordl",
  initialState,
  reducers: {
    setWord(state, action) {
      state.correctWord = action.payload;
      state.correctWordCopy = action.payload;
    },
    setKeyboard(state) {
      state.keyboard.forEach((row) =>
        row.forEach((button) => (button.state = null))
      );
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
      state.keyboard = actions.payload.keyboard;
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
      const {
        correctWordCopy,
        guessedWords,
        container,
        keyboard,
        activeColumn,
      } = state;
      const correctWordLetters = correctWordCopy.split("");
      const guessedWord = action.payload;
      // Update guessed words
      guessedWords.push(guessedWord);
      // Create a helper function to update keyboard states
      const updateKeyboardState = (letter, newState) => {
        for (const row of keyboard) {
          const index = row.findIndex(
            (button) => button.key.toLowerCase() === letter
          );
          if (index > -1) {
            if (row[index].state === true) return;
            if (row[index].state === undefined && newState === false) return;

            row[index].state = newState;
          }
        }
      };
      // Process the guessed word
      container[activeColumn].forEach((box, index) => {
        const letter = box.letter;
        if (letter === correctWordCopy[index]) {
          updateKeyboardState(letter, true);
          box.isCorrect = true;
          correctWordLetters[index] = "";
        }
      });

      container[activeColumn].forEach((box) => {
        const letter = box.letter;
        if (correctWordLetters.includes(letter)) {
          updateKeyboardState(letter, undefined);
          box.isCorrect = undefined;
          correctWordLetters[correctWordLetters.indexOf(letter)] = "";
        } else if (box.isCorrect !== true) {
          updateKeyboardState(letter, false);
          box.isCorrect = false;
        }
      });

      // Move to the next column and reset the row
      state.activeColumn++;
      state.activeRow = 0;

      // Check if the game is over
      if (state.activeColumn === container.length) {
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
    dispatch(wordlActions.setKeyboard());
    dispatch(wordlActions.setWord(randomWord));
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
