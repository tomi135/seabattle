import { useEffect, useState, useRef } from "react";
import { ALPHABETS, CONSTANTS, MISC } from "../constants";
import { drawSeabattle } from "../drawing/draw";
import { ICoord } from "../types";
import {
  getShipIndexFromSquare,
  shipOutOfBounds,
} from "../game/pre-game-logic";

import { useSeabattleStore } from "../store/seabattle.store";
import { coordEqual, getCoordinate, outOfBounds } from "../util";

interface IBoardProp {
  type: string;
}

const Board = ({ type }: IBoardProp) => {
  const [square, setSquare] = useState("");
  const [clicked, setClicked] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const state = useSeabattleStore((state) => state);
  const player = state.playerHome;

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const board =
      type === "mine" ? state.playerHome.board : state.playerHome.boardOpponent;
    const ships =
      type === "mine"
        ? state.playerHome.ships
        : state.ended
        ? state.playerAway.ships // if game ended draw all opponent ships
        : state.playerAway.ships.filter((ship) => !ship.floating);
    drawSeabattle(context, board, ships);
  }, [state, type]);

  const canvasClicked = (e: React.MouseEvent) => {
    const canvas = canvasRef.current; //HTMLCanvasElement;
    if (!canvas) return;
    const clickedCoord = getCoordinate(canvas, e);
    if (outOfBounds(clickedCoord)) return;

    setSquare(ALPHABETS[clickedCoord.x + 1] + (clickedCoord.y + 1));
    setClicked(`x: ${clickedCoord.x}, y: ${clickedCoord.y}`);

    if (type === "mine") return;
    if (!state.started) return;
    state.shootBoard(player.playerId, clickedCoord);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (state.started) return;
    const canvas = canvasRef.current; //HTMLCanvasElement;
    if (!canvas) return;
    const clickedCoord = getCoordinate(canvas, e);

    if (player.playerType !== "human") return;

    const shipIndex = getShipIndexFromSquare(clickedCoord, player.ships);
    if (shipIndex < 0) return;

    state.draggingStart(shipIndex, clickedCoord);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (state.started) return;
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
      if (shipOutOfBounds(currCoord, state.dragging)) return;

      state.draggingUpdate(delta);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (state.started) return;
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
      {process.env.NODE_ENV !== "production" && !MISC.HIDE_DEBUG && (
        <div className="header">
          <ul>
            {type === "mine"
              ? player.board.map((value, index) => (
                  <li key={index}>
                    {value.map((v, i) => (
                      <span key={i}>&nbsp;{v}&nbsp;</span>
                    ))}
                  </li>
                ))
              : player.boardOpponent.map((value, index) => (
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
