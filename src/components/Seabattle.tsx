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
    <>
      {game.ended && <GameEnd />}
      <div className="seabattle">
        {/* !game.started && <h1>Seabattle</h1> */}

        <div className="boards">
          {!game.started && (
            <div className="start-view">
              <h1>This is seabattle</h1>
              <button className="start-button" onClick={startGame}>
                Start game
              </button>
            </div>
          )}
          <Board type="mine" />
          {game.started && <Board type="opponent" />}
        </div>
      </div>
    </>
  );
};

export default Seabattle;
