import { ALPHABETS, BoardValues, CONSTANTS } from "../constants";
import { IShip } from "../types";

const drawBoard = (ctx: CanvasRenderingContext2D) => {
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "white";
  ctx.fillRect(
    CONSTANTS.SQUARE_WIDTH,
    CONSTANTS.SQUARE_WIDTH,
    CONSTANTS.CANVAS_SIZE - CONSTANTS.SQUARE_WIDTH,
    CONSTANTS.CANVAS_SIZE - CONSTANTS.SQUARE_WIDTH
  );

  // draw header texts
  for (let i = 1; i < CONSTANTS.SQUARE_COUNT; i++) {
    if (ALPHABETS[i]) {
      ctx.fillText(
        ALPHABETS[i],
        Math.floor(
          (i * CONSTANTS.CANVAS_SIZE) / CONSTANTS.SQUARE_COUNT +
            CONSTANTS.SQUARE_CENTER
        ),
        Math.floor(CONSTANTS.SQUARE_WIDTH - CONSTANTS.CHAR_MARGIN)
      );
    }
  }

  ctx.textBaseline = "middle";
  ctx.textAlign = "right";
  for (let i = 1; i < CONSTANTS.SQUARE_COUNT; i++) {
    ctx.fillText(
      i.toString(),
      Math.floor(CONSTANTS.SQUARE_WIDTH - CONSTANTS.CHAR_MARGIN),
      Math.floor(
        (i * CONSTANTS.CANVAS_SIZE) / CONSTANTS.SQUARE_COUNT +
          CONSTANTS.CANVAS_SIZE / CONSTANTS.SQUARE_COUNT / 2
      )
    );
  }

  // draw vertical lines
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.lineCap = "butt";
  for (let i = 1; i <= CONSTANTS.SQUARE_COUNT + 1; i++) {
    ctx.moveTo(
      Math.floor((i * CONSTANTS.CANVAS_SIZE) / CONSTANTS.SQUARE_COUNT),
      CONSTANTS.CANVAS_SIZE / CONSTANTS.SQUARE_COUNT
    );
    ctx.lineTo(
      Math.floor((i * CONSTANTS.CANVAS_SIZE) / CONSTANTS.SQUARE_COUNT),
      CONSTANTS.CANVAS_SIZE
    );
    ctx.stroke();
  }

  // draw horizontal lines
  for (let i = 1; i <= CONSTANTS.SQUARE_COUNT + 1; i++) {
    ctx.moveTo(
      CONSTANTS.CANVAS_SIZE / CONSTANTS.SQUARE_COUNT,
      Math.floor((i * CONSTANTS.CANVAS_SIZE) / CONSTANTS.SQUARE_COUNT)
    );
    ctx.lineTo(
      CONSTANTS.CANVAS_SIZE,
      Math.floor((i * CONSTANTS.CANVAS_SIZE) / CONSTANTS.SQUARE_COUNT)
    );
    ctx.stroke();
  }
};

const drawShips = (ctx: CanvasRenderingContext2D, ships: IShip[]) => {
  ctx.lineWidth = 5;
  ctx.lineCap = "butt";

  console.log("Ships:", ships);
  for (const ship of ships) {
    ctx.strokeStyle = ship.floating ? "blue" : "red";
    ctx.fillStyle = ship.floating
      ? "rgba(0, 255, 255, 0.3)"
      : "rgba(255, 0,0,0.3)";
    let startX = CONSTANTS.SQUARE_WIDTH * (ship.coordStart.x + 1);
    let startY = CONSTANTS.SQUARE_WIDTH * (ship.coordStart.y + 1);
    if (ship.direction.x < 0) startX += CONSTANTS.SQUARE_WIDTH;
    if (ship.direction.y < 0) startY += CONSTANTS.SQUARE_WIDTH;
    ctx.beginPath();
    ctx.rect(
      startX,
      startY,
      ship.direction.x === 0
        ? CONSTANTS.SQUARE_WIDTH
        : CONSTANTS.SQUARE_WIDTH * ship.direction.x * ship.length,
      ship.direction.y === 0
        ? CONSTANTS.SQUARE_WIDTH
        : CONSTANTS.SQUARE_WIDTH * ship.direction.y * ship.length
    );
    ctx.fill();
    ctx.stroke();
  }
};

const drawCross = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  const emptySpace = 0.2;
  ctx.lineWidth = 5;
  ctx.strokeStyle = "red";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(
    CONSTANTS.SQUARE_WIDTH * (x + 1) + CONSTANTS.SQUARE_WIDTH * emptySpace,
    CONSTANTS.SQUARE_WIDTH * (y + 1) + CONSTANTS.SQUARE_WIDTH * emptySpace
  );
  ctx.lineTo(
    CONSTANTS.SQUARE_WIDTH * (x + 1) +
      CONSTANTS.SQUARE_WIDTH * (1 - emptySpace),
    CONSTANTS.SQUARE_WIDTH * (y + 1) + CONSTANTS.SQUARE_WIDTH * (1 - emptySpace)
  );
  ctx.stroke();
  ctx.moveTo(
    CONSTANTS.SQUARE_WIDTH * (x + 1) + CONSTANTS.SQUARE_WIDTH * emptySpace,
    CONSTANTS.SQUARE_WIDTH * (y + 1) + CONSTANTS.SQUARE_WIDTH * (1 - emptySpace)
  );
  ctx.lineTo(
    CONSTANTS.SQUARE_WIDTH * (x + 1) +
      CONSTANTS.SQUARE_WIDTH * (1 - emptySpace),
    CONSTANTS.SQUARE_WIDTH * (y + 1) + CONSTANTS.SQUARE_WIDTH * emptySpace
  );
  ctx.stroke();
};

const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  const size = 0.15;
  ctx.lineWidth = 0;
  ctx.fillStyle = "blue";
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.arc(
    CONSTANTS.SQUARE_WIDTH * (x + 1) + CONSTANTS.SQUARE_CENTER,
    CONSTANTS.SQUARE_WIDTH * (y + 1) + CONSTANTS.SQUARE_CENTER,
    CONSTANTS.SQUARE_WIDTH * size,
    0,
    2 * Math.PI,
    true
  );
  ctx.fill();
};

const drawSafe = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  const size = 0.1;
  ctx.fillStyle = "gray";
  ctx.strokeStyle = "gray";
  ctx.beginPath();
  ctx.arc(
    CONSTANTS.SQUARE_WIDTH * (x + 1) + CONSTANTS.SQUARE_CENTER,
    CONSTANTS.SQUARE_WIDTH * (y + 1) + CONSTANTS.SQUARE_CENTER,
    CONSTANTS.SQUARE_WIDTH * size,
    0,
    2 * Math.PI
  );
  ctx.fill();
};

const drawSeabattle = (
  ctx: CanvasRenderingContext2D,
  board: number[][],
  ships: IShip[]
): void => {
  console.log("Drawing all...");
  ctx.clearRect(
    0,
    0,
    CONSTANTS.CANVAS_SIZE + CONSTANTS.CANVAS_PADDING,
    CONSTANTS.CANVAS_SIZE + CONSTANTS.CANVAS_PADDING
  );
  drawBoard(ctx);
  drawShips(ctx, ships);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      switch (board[i][j]) {
        case BoardValues.ShotMissed:
          drawCircle(ctx, j, i);
          break;
        case BoardValues.ShipBombed:
          drawCross(ctx, j, i);
          break;
        case BoardValues.Safe:
          drawSafe(ctx, j, i);
          break;
        default:
      }
    }
  }

  // remove weird stroke last of circle
  ctx.beginPath();
  ctx.rect(0, 0, 0, 0);
  ctx.stroke();
};

export { drawSeabattle };
