import { configureStore } from "@reduxjs/toolkit";
import wordlSlicer from "./wordlSlicer";
import uiSlicer from "./uiSlicer";
import wordsSlicer from "./wordsSlicer";

const store = configureStore({
  reducer: { wordlSlicer, uiSlicer, wordsSlicer },
});

export default store;
