import { useDispatch } from "react-redux";
import { getWordlStateThunk, wordlRandomWordThunk } from "./store/wordlSlicer";
import { useEffect } from "react";
import WordlPage from "./pages/WordlPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const wordl = JSON.parse(localStorage.getItem("wordl2"));
    const words = JSON.parse(localStorage.getItem("words2"));

    if (wordl) {
      dispatch(getWordlStateThunk(wordl, words));
      return;
    }
    dispatch(wordlRandomWordThunk());
  }, []);

  return <WordlPage />;
}

export default App;
