const CANVAS_SIZE = 500;
const SQUARE_COUNT = 11;
const SQUARE_WIDTH = CANVAS_SIZE / SQUARE_COUNT;
const SQUARE_CENTER = SQUARE_WIDTH / 2;
const AI_DELAY = 100;
const HIDE_DEBUG = false;

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
export { CONSTANTS, MISC, ALPHABETS, BoardValues, PlayerType, direction };
