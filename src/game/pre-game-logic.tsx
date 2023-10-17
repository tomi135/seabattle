import { BoardValues } from "../constants";
import { ICoord, IDragging, IShip } from "../types";

const shipsDistanceAcceptable = (ship1: IShip, ship2: IShip) => {
  if (
    Math.abs(ship1.coordStart.x - ship2.coordStart.x) <= 1 &&
    Math.abs(ship1.coordStart.y - ship2.coordStart.y) <= 1
  )
    return false;

  if (
    Math.abs(ship1.coordEnd.x - ship2.coordEnd.x) <= 1 &&
    Math.abs(ship1.coordEnd.y - ship2.coordEnd.y) <= 1
  )
    return false;

  if (
    Math.abs(ship1.coordStart.x - ship2.coordEnd.x) <= 1 &&
    Math.abs(ship1.coordStart.y - ship2.coordEnd.y) <= 1
  )
    return false;

  if (
    Math.abs(ship1.coordEnd.x - ship2.coordStart.x) <= 1 &&
    Math.abs(ship1.coordEnd.y - ship2.coordStart.y) <= 1
  )
    return false;

  return true;
};

const shipAdjacentToOther = (ships: IShip[]) => {
  for (const ship of ships) ship.acceptable = true;
  for (let i = 0; i < ships.length; i++) {
    const s = ships[i];
    for (let j = i + 1; j < ships.length; j++) {
      if (!shipsDistanceAcceptable(s, ships[j])) {
        s.acceptable = false;
        ships[j].acceptable = false;
      }
    }
  }
};

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

const getShipFromSquare = (square: ICoord, ships: IShip[]) => {
  for (const ship of ships) {
    for (let i = 0; i < ship.length; i++) {
      if (
        ship.coordStart.x + i * ship.direction.x === square.x &&
        ship.coordStart.y + i * ship.direction.y === square.y
      )
        return ship;
    }
  }
  return null;
};

const getShipIndexFromSquare = (square: ICoord, ships: IShip[]): number => {
  for (let j = 0; j < ships.length; j++) {
    for (let i = 0; i < ships[j].length; i++) {
      if (
        ships[j].coordStart.x + i * ships[j].direction.x === square.x &&
        ships[j].coordStart.y + i * ships[j].direction.y === square.y
      )
        return j;
    }
  }
  return -1;
};

const shipOutOfBounds = (currCoord: ICoord, dragging: IDragging): boolean => {
  const deltaX = currCoord.x - dragging.coordClick.x;
  const deltaY = currCoord.y - dragging.coordClick.y;

  if (
    dragging.originalCoordStart.x + deltaX < 0 ||
    9 < dragging.originalCoordStart.x + deltaX ||
    dragging.originalCoordStart.y + deltaY < 0 ||
    9 < dragging.originalCoordStart.y + deltaY ||
    dragging.originalCoordEnd.x + deltaX < 0 ||
    9 < dragging.originalCoordEnd.x + deltaX ||
    dragging.originalCoordEnd.y + deltaY < 0 ||
    9 < dragging.originalCoordEnd.y + deltaY
  ) {
    return true;
  }

  return false;
};

export {
  shipAdjacentToOther,
  shipAcceptableOnBoard,
  shipToBoard,
  getShipFromSquare,
  getShipIndexFromSquare,
  shipOutOfBounds,
};
