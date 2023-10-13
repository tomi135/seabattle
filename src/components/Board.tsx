import { useEffect, useState, useRef } from "react";
import { ALPHABETS, CONSTANTS, MISC } from "../constants";
import { drawSeabattle } from "../drawing/draw";
import { ICoord, IPlayer } from "../types";
import { getShipIndexFromSquare, outOfBounds } from "../game/logic";

import { useSeabattleStore } from "../store/seabattle.store";

interface IBoardProp {
  type: string;
  player: IPlayer;
}

const Board = ({ player }: IBoardProp) => {
  const [square, setSquare] = useState("");
  const [squareCoord, setSquareCoord] = useState<ICoord | undefined>(undefined);
  const [clicked, setClicked] = useState("");
  //const [dragging, setDragging] = useState<IDragging | undefined>(undefined);
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

    const canvas = e.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const canvasWidth = canvas.clientWidth - CONSTANTS.CANVAS_PADDING;

    const row = Math.floor(
      (e.clientY - rect.top) / (canvasWidth / CONSTANTS.SQUARE_COUNT)
    );
    const column = Math.floor(
      (e.clientX - rect.left) / (canvasWidth / CONSTANTS.SQUARE_COUNT)
    );
    setSquareCoord({
      x: Math.floor(e.clientX - rect.left),
      y: Math.floor(e.clientY - rect.top),
    });
    setClicked(`x: ${column}, y: ${row}`);
    if (column < 1 || 10 < column || row < 1 || 10 < row) return;

    //shootBoard(player.id, column, row);
    //drawIntoSquare();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = e.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const canvasWidth = canvas.clientWidth - CONSTANTS.CANVAS_PADDING;
    const row = Math.floor(
      (e.clientY - rect.top) / (canvasWidth / CONSTANTS.SQUARE_COUNT)
    );
    const column = Math.floor(
      (e.clientX - rect.left) / (canvasWidth / CONSTANTS.SQUARE_COUNT)
    );
    const clickedCoord = {
      x: column - 1,
      y: row - 1,
    };

    if (player.playerType !== "human") return;

    const shipIndex = getShipIndexFromSquare(clickedCoord, player.ships);
    console.log("Square contains ship:", shipIndex);
    if (shipIndex < 0) return;

    state.draggingStart(shipIndex, clickedCoord);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current; //e.target as HTMLCanvasElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const canvasWidth = canvas.clientWidth - CONSTANTS.CANVAS_PADDING;
    setSquareCoord({
      x: Math.floor(e.clientX - rect.left),
      y: Math.floor(e.clientY - rect.top),
    });
    const row = Math.floor(
      (e.clientY - rect.top) / (canvasWidth / CONSTANTS.SQUARE_COUNT)
    );
    const column = Math.floor(
      (e.clientX - rect.left) / (canvasWidth / CONSTANTS.SQUARE_COUNT)
    );
    setSquare("" + ALPHABETS[column] + row);
    setSquareCoord({ x: column, y: row });

    if (!state.dragging) return;

    const currCoord = {
      x: column - 1,
      y: row - 1,
    };
    if (
      currCoord.x < 0 ||
      9 < currCoord.x ||
      currCoord.y < 0 ||
      9 < currCoord.y
    ) {
      //state.draggingEnd();
      return;
    }
    const delta: ICoord = {
      x: currCoord.x - state.dragging.coordClick.x,
      y: currCoord.y - state.dragging.coordClick.y,
    };
    if (
      state.dragging.coordDelta.x !== delta.x ||
      state.dragging.coordDelta.y !== delta.y
    ) {
      console.log("Delta:", delta);
      if (outOfBounds(currCoord, state.dragging)) return;

      state.draggingUpdate(delta);
    }
  };

  const handleMouseUp = () => {
    state.draggingEnd();
  };

  return (
    <div className="board">
      <div className="header">
        {process.env.NODE_ENV !== "production" && !MISC.HIDE_DEBUG && (
          <>
            Square: {square}
            <br />
            Square coordinates x: {squareCoord?.x}, y: {squareCoord?.y}
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
