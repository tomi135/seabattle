import { useSeabattleStore } from "../store/seabattle.store";
import Board from "./Board";

const Seabattle = () => {
  const game = useSeabattleStore((state) => state);

  const newGame = (e: React.MouseEvent) => {
    console.log("New game event:", e);
  };
  const startGame = (e: React.MouseEvent) => {
    console.log("Startgame event:", e);
    game.start();
  };

  return (
    <div className="seabattle">
      <h1>Seabattle</h1>
      {game.ended && (
        <div className="end-container">
          <div className="ended">
            <h2>Game end</h2>
            <button onClick={newGame}>New game</button>
          </div>
        </div>
      )}
      {!game.started && (
        <div className="start-view">
          <p>This is seabattle</p>
          <button onClick={startGame}>Start game</button>
        </div>
      )}
      {game.started && (
        <div className="boards">
          <Board type="mine" player={game.playerHome} />
          <Board type="opponent" player={game.playerAway} />
        </div>
      )}
    </div>
  );
};

export default Seabattle;
