import { useEffect } from "react";
import { useSeabattleStore } from "../store/seabattle.store";
import Board from "./Board";
import { PlayerType } from "../constants";
import { AIshoot } from "../game/ai";

const Seabattle = () => {
  const game = useSeabattleStore((state) => state);

  useEffect(() => {
    if (game.inTurn !== PlayerType.Computer) return;

    AIshoot(game.playerAway, game.shootBoard);
  }, [game]);
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
      <div className="boards">
        <Board type="mine" />
        {game.started && <Board type="opponent" />}
      </div>
    </div>
  );
};

export default Seabattle;
