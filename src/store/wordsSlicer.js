import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  words: [],
};

const wordsSlicer = createSlice({
  name: "words",
  initialState,
  reducers: {
    setWords(state, actions) {
      state.words = actions.payload;
    },
  },
});

export default wordsSlicer.reducer;
export const wordsActions = wordsSlicer.actions;
