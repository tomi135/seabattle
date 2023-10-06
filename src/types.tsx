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
  direction: ICoord;
  length: number;
  hitSquares: number;
  floating: boolean;
}

interface IDragging {
  ship: null | IShip;
  coordStart: null | ICoord;
  coordDelta: null | ICoord;
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
