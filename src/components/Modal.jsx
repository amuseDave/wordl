import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetGameThunk } from "../store/wordlSlicer";

export default function Modal() {
  const dispatch = useDispatch();
  const isWinner = useSelector((state) => state.wordlSlicer.isWinner);
  const words = useSelector((state) => state.wordsSlicer.words);
  const correctWord = useSelector((state) => state.wordlSlicer.correctWord);
  const dialogRef = useRef();

  function handleResetGame() {
    dialogRef.current.classList.remove("modal-show");
    dispatch(resetGameThunk(words));
  }

  useEffect(() => {
    if (isWinner || isWinner === false) {
      setTimeout(() => {
        dialogRef.current.showModal();
      }, 5);
      setTimeout(() => {
        dialogRef.current.classList.add("modal-show");
      }, 10);
    }

    return () => {
      dialogRef.current.classList.remove("modal-show");
    };
  }, [isWinner, dialogRef]);

  return createPortal(
    <dialog ref={dialogRef} className="modal">
      <form method="dialog" className="modal-content">
        <h1 className={isWinner ? `winner-text` : "loser-text"}>
          {isWinner
            ? "Congratulations!"
            : isWinner === false
            ? "Opps, Try again!"
            : ""}
        </h1>
        {isWinner ? (
          ""
        ) : (
          <h1 className="modal-correct-word">
            Correct Word
            <br /> <span>"{correctWord}"</span>
          </h1>
        )}

        <button onClick={handleResetGame}>Reset Game</button>
      </form>
    </dialog>,
    document.getElementById("modal")
  );
}
