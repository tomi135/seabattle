interface ICoord {
  x: number;
  y: number;
}

interface IDragging {
  ship: null;
  coordStart: null | ICoord;
  coordDelta: null | ICoord;
}

interface IShip {
  coordStart: ICoord;
  direction: ICoord;
  length: number;
  hitSquares: number;
  floating: boolean;
}

export type { ICoord, IDragging, IShip };
