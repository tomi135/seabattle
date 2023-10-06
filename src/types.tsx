interface ICoord {
  x: number;
  y: number;
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

export type { ICoord, IDragging, IShip };
