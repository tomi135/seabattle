import { ICoord, IShip } from "./types";

const coordSum = (c1: ICoord, c2: ICoord): ICoord => {
  return {
    x: c1.x + c2.x,
    y: c1.y + c2.y,
  };
};

const coordSubtract = (c1: ICoord, c2: ICoord): ICoord => {
  return {
    x: c1.x - c2.x,
    y: c1.y - c2.y,
  };
};

const copyShip = (ship: IShip): IShip => {
  const newShip = {
    coordStart: ship.coordStart,
    coordEnd: ship.coordEnd,
    direction: ship.direction,
    length: ship.length,
    hitSquares: ship.hitSquares,
    floating: ship.floating,
    acceptable: ship.acceptable,
  };
  return newShip;
};

export { coordSum, coordSubtract, copyShip };
