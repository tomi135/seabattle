interface ICoord {
  x: number;
  y: number;
}

interface ILastHit {
  start?: ICoord;
  hit?: ICoord;
  direction?: ICoord;
  length?: number;
  miss?: boolean;
}

interface IShip {
  coordStart: ICoord;
  coordEnd: ICoord;
  direction: ICoord;
  length: number;
  hitSquares: number;
  floating: boolean;
  acceptable: boolean;
}

interface IDragging {
  shipIndex: number;
  originalCoordStart: ICoord;
  originalCoordEnd: ICoord;
  coordClick: ICoord;
  coordDelta: ICoord;
}

interface IPlayer {
  playerId: number;
  playerType: string;
  name: string;
  board: number[][];
  boardOpponent: number[][];
  myShots: ICoord[];
  ships: IShip[];
  lastHit: ILastHit | null;
}

interface IBoardsUpdated {
  boardCurrPlayer: number[][];
  boardOpponent: number[][];
}

interface IDidShotHit {
  updatedShips: IShip[];
  hitShip: IShip | null;
}

export type {
  ICoord,
  ILastHit,
  IDragging,
  IShip,
  IPlayer,
  IBoardsUpdated,
  IDidShotHit,
};
