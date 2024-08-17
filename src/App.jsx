import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getWordlStateThunk, wordlRandomWordThunk } from "./store/wordlSlicer";
import { useEffect } from "react";
import RootPage from "./pages/RootPage";
import ErrorPage from "./pages/ErrorPage";
// import QuizPage from "./pages/QuizPage";
import WordlPage from "./pages/WordlPage";
// import TicTacToePage from "./pages/TicTacToePage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const wordl = JSON.parse(localStorage.getItem("wordl"));
    const words = JSON.parse(localStorage.getItem("words"));

    if (wordl) {
      dispatch(getWordlStateThunk(wordl, words));
      return;
    }
    dispatch(wordlRandomWordThunk());
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootPage />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <WordlPage /> },
        // { path: "tic-tac-toe", element: <TicTacToePage /> },
        // { path: "quiz", element: <QuizPage /> },
      ],
    },
  ]);

  return <WordlPage />;
}

export default App;
