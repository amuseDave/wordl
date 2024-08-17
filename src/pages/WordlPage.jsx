import WordlGame from "../components/WordlGame";
import Modal from "../components/Modal";
import Keyboard from "../components/Keyboard.jsx";

export default function WordlPage() {
  return (
    <div className="wordl">
      <h1 className="title-wordl">Wordl</h1>
      <WordlGame />
      <Modal />
      <Keyboard />
    </div>
  );
}
