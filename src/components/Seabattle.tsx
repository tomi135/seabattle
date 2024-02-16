import { useEffect } from "react";
import { useSeabattleStore } from "../store/seabattle.store";
import Board from "./Board";
import { PlayerType } from "../constants";
import { AIshoot } from "../game/ai";
import GameEnd from "./GameEnd";

const Seabattle = () => {
  const game = useSeabattleStore((state) => state);

  useEffect(() => {
    if (game.inTurn !== PlayerType.Computer) return;

    AIshoot(game.playerAway, game.shootBoard);
  }, [game]);

  const startGame = () => {
    game.start();
  };

  return (
    <div className="seabattle">
      <h1>Seabattle</h1>
      {game.ended && <GameEnd />}
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
