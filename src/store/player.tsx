import { IPlayer } from "../types";

const createPlayer = (id: number, name: string): IPlayer => {
  const player = {
    playerId: id,
    playerType: id === 1 ? "human" : "computer",
    name: name,
    board: Array.from(Array(10), () => Array(10).fill(0)),
    boardOpponent: Array.from(Array(10), () => Array(10).fill(0)),
    myShots: [],
    ships: [],
    lastHit: null,
  };

  return player;
};

export { createPlayer };
