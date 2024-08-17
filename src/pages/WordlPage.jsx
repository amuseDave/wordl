import WordlGame from "../components/WordlGame";
import Modal from "../components/Modal";

export default function WordlPage() {
  return (
    <div className="wordl">
      <h1 className="title-wordl">Wordl mini-game</h1>
      <WordlGame />
      <Modal />
    </div>
  );
}
