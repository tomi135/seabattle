import { BoardValues } from "../constants";
import { IShip } from "../types";

const shipAcceptableOnBoard = (board: number[][], ship: IShip): boolean => {
  const startCoord = ship.coordStart;
  const direction = ship.direction;
  const length = ship.length;

  // test if ship is fully on board
  if (
    startCoord.x + direction.x * (length - 1) < 0 ||
    startCoord.x + direction.x * (length - 1) > 9 ||
    startCoord.y + direction.y * (length - 1) < 0 ||
    startCoord.y + direction.y * (length - 1) > 9
  ) {
    return false;
  }

  // test if all squares under ship are available
  for (let k = 0; k < length; k++) {
    const currX = startCoord.x + direction.x * k;
    const currY = startCoord.y + direction.y * k;

    // index out of bounds. Shouldn't be possible so never happening
    if (currX < 0 || 9 < currX || currY < 0 || 9 < currY) return false;

    // test if ship is on top of some other ship
    if (board[currY][currX] !== BoardValues.Empty) return false;

    // test if ship is too close to some other ship
    const previousCoord = { x: -999, y: -999 };
    const nextCoord =
      k === length - 1
        ? { x: -999, y: -999 }
        : { x: currX + direction.x, y: currY + direction.y };
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const coordX = currX + j;
        const coordY = currY + i;
        if (coordX < 0 || 9 < coordX) continue;
        if (coordY < 0 || 9 < coordY) continue;
        if (previousCoord.x === coordX && previousCoord.y === coordY) continue;
        if (i === 0 && j === 0) continue;
        if (coordX === nextCoord.x && coordY === nextCoord.y) continue;
        if (
          Math.abs(board[coordY][coordX]) !== BoardValues.Empty // SquareState.Ship
        ) {
          //logger.info("ship cant be directly adjacent square of other ship");
          return false;
        }
      }
    }
  }

  //logger.info("test ship ok");
  return true;
};

const shipToBoard = (board: number[][], ship: IShip): void => {
  for (let i = 0; i < ship.length; i++) {
    const nextX = ship.coordStart.x + i * ship.direction.x;
    const nextY = ship.coordStart.y + i * ship.direction.y;
    if (0 <= nextX && nextX < 10 && 0 <= nextY && nextY < 10) {
      board[nextY][nextX] = BoardValues.ShipUnbombHidden;
    }
  }
};

export { shipAcceptableOnBoard, shipToBoard };
