import { MISC, direction } from "../constants";
import { ICoord, ILastHit, IPlayer } from "../types";
import { canShoot } from "./game-logic";

const canShootSquare = (board: number[][], coord: ICoord) => {
  if (coord.x < 0 || 9 < coord.x) return false;
  if (coord.y < 0 || 9 < coord.y) return false;
  return canShoot(board[coord.y][coord.x]);
};

const getAvailableAdjacents = (board: number[][], coord: ICoord): ICoord[] => {
  const empties: ICoord[] = [];

  let dir = direction[0];
  let currX = coord.x;
  let currY = coord.y;
  for (let i = 0; i < 4; i++) {
    dir = direction[i];
    currX = coord.x + dir.x;
    currY = coord.y + dir.y;
    if (currX < 0 || 9 < currX) continue;
    if (currY < 0 || 9 < currY) continue;
    if (canShoot(board[currY][currX])) empties.push({ x: currX, y: currY });
  }
  return empties;
};

// const getOpenDirections = (board: number[][], coord: ICoord): ICoord[] => {
//   const openDirs: ICoord[] = [];
//   let currX = coord.x;
//   let currY = coord.y;
//   for (const dir of direction) {
//     currX = coord.x + dir.x;
//     currY = coord.y + dir.y;
//     if (currX < 0 || 9 < currX) continue;
//     if (currY < 0 || 9 < currY) continue;
//     if (canShoot(board[currY][currX])) openDirs.push(dir);
//   }
//   return openDirs;
// };

const getOppositeDirection = (direction: ICoord) => {
  return { x: direction.x * -1, y: direction.y * -1 };
};

const shootAdjacent = (board: number[][], lasthit: ILastHit) => {
  let nextShoot: ICoord = { x: -1, y: -1 };
  if (lasthit.miss && lasthit.direction)
    lasthit = {
      ...lasthit,
      direction: getOppositeDirection(lasthit.direction),
      length: 1,
    };
  if (lasthit.direction && lasthit.length && lasthit.start) {
    nextShoot = {
      x: lasthit.start.x + lasthit.direction.x * lasthit.length,
      y: lasthit.start.y + lasthit.direction.y * lasthit.length,
    };
    if (!canShootSquare(board, nextShoot)) {
      lasthit = {
        ...lasthit,
        direction: { x: lasthit.direction.x * -1, y: lasthit.direction.y * -1 },
        length: 1,
      };
      if (lasthit.direction && lasthit.length && lasthit.start) {
        nextShoot = {
          x: lasthit.start.x + lasthit.direction.x * lasthit.length,
          y: lasthit.start.y + lasthit.direction.y * lasthit.length,
        };
      }
    }
    if (canShootSquare(board, nextShoot)) return nextShoot;
  }
  const freeSquares = getAvailableAdjacents(
    board,
    lasthit.start ?? { x: -1, y: -1 }
  );
  nextShoot = freeSquares[Math.floor(Math.random() * freeSquares.length)];

  return nextShoot;
};

const AIshoot = (
  player: IPlayer,
  callback: (id: number, coord: ICoord) => void
) => {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const shoot = async (id: number, coord: ICoord) => {
    await delay(MISC.AI_DELAY);

    console.log("Computer shoots: ", coord);
    callback(id, coord);
  };

  let coord: ICoord | undefined = undefined;
  const boardOpponent = player.boardOpponent;
  console.log(
    `Player ${player.name}, lastHit:, ${JSON.stringify(player.lastHit)}`
  );
  if (player.lastHit?.start) {
    console.log("Board opponent:", boardOpponent);
    coord = shootAdjacent(boardOpponent, player.lastHit);
    console.log(`Next square to shoot: ${JSON.stringify(coord)}`);
    if (coord) return shoot(player.playerId, coord);
  }

  const emptySquares = [];
  for (let i = 0; i < 100; i++) {
    if (canShoot(boardOpponent[Math.floor(i / 10)][i % 10]))
      emptySquares.push(i);
  }
  const index = Math.floor(Math.random() * emptySquares.length);
  coord = {
    x: emptySquares[index] % 10,
    y: Math.floor(emptySquares[index] / 10),
  };

  shoot(player.playerId, coord);
};

//const internal = { getAvailableAdjacents, getOpenDirections };
export { AIshoot };
