import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isWrongWord: false,
  isCorrectWord: false,
};

const uiSlicer = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setWrongWord(state, action) {
      state.isWrongWord = action.payload;
      clearTimeout(state.timeout);
    },
    clearWrongWord(state) {
      state.isWrongWord = false;
    },
  },
});

export default uiSlicer.reducer;
export const uiActions = uiSlicer.actions;
