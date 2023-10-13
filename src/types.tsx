interface ICoord {
  x: number;
  y: number;
}

interface ILastHit {
  hit?: ICoord;
  direction?: ICoord;
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

export type { ICoord, IDragging, IShip, IPlayer };
