const CANVAS_SIZE = 500;
const SQUARE_COUNT = 11;
const SQUARE_WIDTH = CANVAS_SIZE / SQUARE_COUNT;
const SQUARE_CENTER = SQUARE_WIDTH / 2;
const AI_DELAY = 300;
const HIDE_DEBUG = true;

const CONSTANTS = {
  CANVAS_SIZE: CANVAS_SIZE,
  SQUARE_COUNT: SQUARE_COUNT,
  SQUARE_WIDTH: SQUARE_WIDTH,
  SQUARE_CENTER: SQUARE_CENTER,

  CANVAS_PADDING: 10,
  CHAR_MARGIN: 10,
} as const;

const MISC = {
  AI_DELAY: AI_DELAY,
  HIDE_DEBUG: HIDE_DEBUG,
} as const;

const ALPHABETS = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

const CSS = {
  SHIP_FLOATING_STROKE: "blue",
  SHIP_FLOATING_FILL: "rgba(0, 255, 255, 0.3)",
  SHIP_SUNKEN_STROKE: "red",
  SHIP_SUNKEN_FILL: "rgba(255, 0,0,0.3)",
  SHIP_NOT_ACCEPTABLE_STROKE: "brown",
  SHIP_NOT_ACCEPTABLE_FILL: "rgba(166, 145, 92, 0.3)",
  CIRCLE: "blue",
  CROSS: "red",
  SAFE: "gray",
};

const BoardValues = {
  Empty: 0,
  ShipUnbombVisible: 1,
  ShipUnbombHidden: 2,
  ShotMissed: 3,
  ShipBombed: 4,
  Safe: 5,
};

const PlayerType = {
  Human: 1,
  Computer: 2,
};

const up = { x: 0, y: -1 }; // 0 - up
const right = { x: 1, y: 0 }; // 1 - right
const down = { x: 0, y: 1 }; // 2 - down
const left = { x: -1, y: 0 }; // 3 - left
const none = { x: 0, y: 0 }; // 4 - stay put
const direction = [up, right, down, left, none];

// eslint-disable-next-line react-refresh/only-export-components
export { CONSTANTS, MISC, ALPHABETS, CSS, BoardValues, PlayerType, direction };
