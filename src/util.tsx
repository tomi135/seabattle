import { CONSTANTS } from "./constants";
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

const coordEqual = (c1: ICoord, c2: ICoord): boolean => {
  return c1.x === c2.x && c1.y === c2.y;
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

const getCoordinate = (
  canvas: HTMLCanvasElement,
  e: React.MouseEvent
): ICoord => {
  const rect = canvas.getBoundingClientRect();

  const canvasWidth = canvas.clientWidth - CONSTANTS.CANVAS_PADDING;
  const row = Math.floor(
    (e.clientY - rect.top) / (canvasWidth / CONSTANTS.SQUARE_COUNT)
  );
  const column = Math.floor(
    (e.clientX - rect.left) / (canvasWidth / CONSTANTS.SQUARE_COUNT)
  );

  const currCoord: ICoord = {
    x: column - 1,
    y: row - 1,
  };
  return currCoord;
};

const outOfBounds = (coordinate: ICoord): boolean => {
  if (
    coordinate.x < 0 ||
    9 < coordinate.x ||
    coordinate.y < 0 ||
    9 < coordinate.y
  ) {
    return true;
  }
  return false;
};

export {
  coordSum,
  coordSubtract,
  coordEqual,
  copyShip,
  getCoordinate,
  outOfBounds,
};
