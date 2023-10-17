import { BoardValues } from "../constants";
import {
  IBoardsUpdated,
  ICoord,
  IDidShotHit,
  ILastHit,
  IPlayer,
  IShip,
} from "../types";
import { copyBoard } from "../util";

const canShoot = (value: number) => {
  return (
    value === BoardValues.Empty ||
    value === BoardValues.ShipUnbombVisible ||
    value === BoardValues.ShipUnbombHidden
  );
};

const didShotHit = (ships: IShip[], coord: ICoord): IDidShotHit => {
  let hitShip = null;
  const updatedShips = ships.map((ship) => {
    for (let i = 0; i < ship.length; i++) {
      const nextX = ship.coordStart.x + i * ship.direction.x;
      const nextY = ship.coordStart.y + i * ship.direction.y;
      if (nextX === coord.x && nextY === coord.y) {
        const updatedShip = { ...ship };
        updatedShip.hitSquares += 1;
        if (updatedShip.hitSquares === updatedShip.length) {
          updatedShip.floating = false;
        }
        hitShip = updatedShip;
        return updatedShip;
      }
    }
    return ship;
  });
  return { updatedShips, hitShip };
};

const putSafeSquaresAroundShip = (
  boards: IBoardsUpdated,
  ship: IShip
): IBoardsUpdated => {
  // make a copy of boards
  const boardCurrPlayer = copyBoard(boards.main);
  const boardOpponent = copyBoard(boards.opponent);

  for (let i = 0; i < ship.length; i++) {
    const shipCoordX = ship.coordStart.x + i * ship.direction.x;
    const shipCoordY = ship.coordStart.y + i * ship.direction.y;
    for (let j = -1; j <= 1; j++) {
      for (let k = -1; k <= 1; k++) {
        const coordX = shipCoordX + k;
        const coordY = shipCoordY + j;
        if (coordX < 0 || 9 < coordX || coordY < 0 || 9 < coordY) continue;
        if (boardCurrPlayer[coordY][coordX] === BoardValues.Empty) {
          boardCurrPlayer[coordY][coordX] = BoardValues.Safe;
          boardOpponent[coordY][coordX] = BoardValues.Safe;
        }
      }
    }
  }
  return { main: boardCurrPlayer, opponent: boardOpponent };
};

const updateBoard = (
  boardMain: number[][],
  boardOpponent: number[][],
  coord: ICoord,
  hitShip: IShip | null
): IBoardsUpdated => {
  const main = [];
  const opponent = [];
  for (let i = 0; i < boardMain.length; i++) {
    main[i] = [...boardMain[i]];
    opponent[i] = [...boardOpponent[i]];
    if (i === coord.y) {
      //updatedBoard[i][x] = value;
      if (hitShip) {
        main[coord.y][coord.x] = BoardValues.ShipBombed;
        opponent[coord.y][coord.x] = BoardValues.ShipBombed;
      } else {
        main[coord.y][coord.x] = BoardValues.ShotMissed;
        opponent[coord.y][coord.x] = BoardValues.ShotMissed;
      }
    }
  }
  return { main, opponent };
};

const updateHitObject = (lastHit: ILastHit | null, coord: ICoord): ILastHit => {
  if (!lastHit?.start)
    return { start: coord, hit: coord, length: 1 } as ILastHit;
  lastHit = {
    start: lastHit.start,
    direction: {
      x:
        coord.x - lastHit.start.x === 0
          ? 0
          : (coord.x - lastHit.start.x) / Math.abs(coord.x - lastHit.start.x),
      y:
        coord.y - lastHit.start.y === 0
          ? 0
          : (coord.y - lastHit.start.y) / Math.abs(coord.y - lastHit.start.y),
    },
    length:
      Math.abs(coord.x - lastHit.start.x) > Math.abs(coord.y - lastHit.start.y)
        ? Math.abs(coord.x - lastHit.start.x) + 1
        : Math.abs(coord.y - lastHit.start.y) + 1,
  };
  return lastHit as ILastHit;
};

const didGameEnd = (ships: IShip[]) => {
  for (let i = 0; i < ships.length; i++) {
    if (ships[i].hitSquares !== ships[i].length) return false;
  }
  return true;
};

const changeTurn = (
  inTurn: number,
  current: IPlayer,
  opponent: IPlayer
): number => {
  return inTurn === current.playerId ? opponent.playerId : current.playerId;
};

export {
  canShoot,
  didShotHit,
  updateBoard,
  updateHitObject,
  putSafeSquaresAroundShip,
  didGameEnd,
  changeTurn,
};
