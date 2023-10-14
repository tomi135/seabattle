import { IPlayer } from "../types";
import { ICoord, IShip } from "../types";
import { direction as dir } from "../constants";
import { shipAcceptableOnBoard, shipToBoard } from "../game/pre-game-logic";

const createShip = (
  length: number,
  startCoord?: ICoord,
  direction?: ICoord
): IShip => {
  if (!startCoord)
    startCoord = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    };
  if (!direction)
    direction =
      length > 1
        ? dir[Math.floor(Math.random() * (dir.length - 1))]
        : dir[dir.length - 1];

  const coordEnd: ICoord = {
    x: startCoord.x + direction.x * (length - 1),
    y: startCoord.y + direction.y * (length - 1),
  };
  const ship = {
    coordStart: startCoord,
    coordEnd: coordEnd,
    direction: direction,
    length: length,
    hitSquares: 0,
    floating: true,
    acceptable: true,
  };
  return ship;
};

const createShips = (): IShip[] => {
  const board = Array.from(Array(10), () => Array(10).fill(0));
  const ships = [];
  let length = 4;

  while (length > 0) {
    const ship = createShip(length);

    if (shipAcceptableOnBoard(board, ship)) {
      shipToBoard(board, ship); // ship to temp board
      ships.push(ship);
      if (
        ships.length === 1 ||
        ships.length === 3 ||
        ships.length === 6 ||
        ships.length >= 10
      ) {
        length--;
      }
    }
  }
  return ships;
};

const createPlayer = (id: number, name: string): IPlayer => {
  const player = {
    playerId: id,
    playerType: id === 1 ? "human" : "computer",
    name: name,
    board: Array.from(Array(10), () => Array(10).fill(0)),
    boardOpponent: Array.from(Array(10), () => Array(10).fill(0)),
    myShots: [],
    ships: createShips(),
    lastHit: null,
  };

  return player;
};

export { createPlayer };
