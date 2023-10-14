import { useEffect, useState, useRef } from "react";
import { ALPHABETS, CONSTANTS, MISC } from "../constants";
import { drawSeabattle } from "../drawing/draw";
import { ICoord, IPlayer } from "../types";
import { getShipIndexFromSquare, shipOutOfBounds } from "../game/logic";

import { useSeabattleStore } from "../store/seabattle.store";
import { coordEqual, getCoordinate, outOfBounds } from "../util";

interface IBoardProp {
  type: string;
  player: IPlayer;
}

const Board = ({ player }: IBoardProp) => {
  const [square, setSquare] = useState("");
  const [clicked, setClicked] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const state = useSeabattleStore((state) => state);

  useEffect(() => {
    if (!player) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    drawSeabattle(context, player.board, player.ships);
  }, [player]);

  const canvasClicked = (e: React.MouseEvent) => {
    //if (name === "mine") return;

    const canvas = canvasRef.current; //HTMLCanvasElement;
    if (!canvas) return;
    const clickedCoord = getCoordinate(canvas, e);
    if (outOfBounds(clickedCoord)) return;

    setSquare(ALPHABETS[clickedCoord.x + 1] + (clickedCoord.y + 1));
    setClicked(`x: ${clickedCoord.x}, y: ${clickedCoord.y}`);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current; //HTMLCanvasElement;
    if (!canvas) return;
    const clickedCoord = getCoordinate(canvas, e);

    if (player.playerType !== "human") return;

    const shipIndex = getShipIndexFromSquare(clickedCoord, player.ships);
    console.log("Square contains ship:", shipIndex);
    if (shipIndex < 0) return;

    state.draggingStart(shipIndex, clickedCoord);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!state.dragging) return;

    const canvas = canvasRef.current; //e.target as HTMLCanvasElement;
    if (!canvas) return;
    const currCoord = getCoordinate(canvas, e);

    if (outOfBounds(currCoord)) return;

    const delta: ICoord = {
      x: currCoord.x - state.dragging.coordClick.x,
      y: currCoord.y - state.dragging.coordClick.y,
    };
    if (
      state.dragging.coordDelta.x !== delta.x ||
      state.dragging.coordDelta.y !== delta.y
    ) {
      console.log("Delta:", delta);
      if (shipOutOfBounds(currCoord, state.dragging)) return;

      state.draggingUpdate(delta);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!state.dragging) return;

    const canvas = canvasRef.current; //e.target as HTMLCanvasElement;
    if (!canvas) return;
    const currCoord = getCoordinate(canvas, e);

    if (coordEqual(currCoord, state.dragging.coordClick)) {
      state.turnShip(state.dragging.shipIndex);
    } else {
      state.draggingEnd();
    }
  };

  return (
    <div className="board">
      <div className="header">
        {process.env.NODE_ENV !== "production" && !MISC.HIDE_DEBUG && (
          <>
            Square: {square}
            <br />
            Clicked {clicked}
          </>
        )}
        <p className="player-name">{player.name}</p>
      </div>
      <div className="canvas-container">
        <canvas
          width={CONSTANTS.CANVAS_SIZE + CONSTANTS.CANVAS_PADDING}
          height={CONSTANTS.CANVAS_SIZE + CONSTANTS.CANVAS_PADDING}
          ref={canvasRef}
          onClick={canvasClicked}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
      {!MISC.HIDE_DEBUG && (
        <div className="header">
          <ul>
            {player.board.map((value, index) => (
              <li key={index}>
                {value.map((v, i) => (
                  <span key={i}>&nbsp;{v}&nbsp;</span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Board;
