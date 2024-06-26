//import "./gameEnd.css";
import { useSeabattleStore } from "../store/seabattle.store";

const GameEnd = () => {
  const game = useSeabattleStore((state) => state);

  const newGame = () => {
    game.newGame();
  };

  return (
    <div className="end-container">
      <div className="ended">
        <p>Game end, {game.winner} win!</p>
        <button className="end-button" onClick={newGame}>
          New game
        </button>
      </div>
    </div>
  );
};

export default GameEnd;
