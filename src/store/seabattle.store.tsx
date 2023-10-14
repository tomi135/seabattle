import { create } from "zustand";
import { ICoord, IDragging, IPlayer, IShip } from "../types";
import { createPlayer } from "./player";
import { coordSum } from "../util";
import { shipAdjacentToOther } from "../game/logic";

interface SeabattleState {
  started: boolean;
  ended: boolean;
  inTurn: IPlayer | undefined;
  dragging: IDragging | undefined;
  playerHome: IPlayer;
  playerAway: IPlayer;
  draggingStart: (n: number, c: ICoord) => void;
  draggingUpdate: (c: ICoord) => void;
  draggingEnd: () => void;
  turnShip: (n: number) => void;
  start: () => void;
  shootBoard: (id: number, coord: ICoord) => void;
}

const useSeabattleStore = create<SeabattleState>()((set) => ({
  started: false,
  ended: false,
  inTurn: undefined,
  dragging: undefined,
  playerHome: createPlayer(1, "Player1"),
  playerAway: createPlayer(2, "Player2"),
  draggingStart: (index, clickedCoord) =>
    set((state) => ({
      ...state,
      dragging: {
        shipIndex: index,
        originalCoordStart: state.playerHome.ships[index].coordStart,
        originalCoordEnd: state.playerHome.ships[index].coordEnd,
        coordClick: clickedCoord,
        coordDelta: { x: 0, y: 0 },
      },
    })),
  draggingUpdate: (delta) =>
    set((state) => {
      if (!state.dragging) return state;

      const updatedShips: IShip[] = [...state.playerHome.ships];
      updatedShips[state.dragging.shipIndex].coordStart = coordSum(
        state.dragging.originalCoordStart,
        delta
      );
      updatedShips[state.dragging.shipIndex].coordEnd = coordSum(
        state.dragging.originalCoordEnd,
        delta
      );
      shipAdjacentToOther(updatedShips);

      const updatedState = {
        ...state,
        dragging: {
          ...state.dragging,
          coordDelta: delta,
        },
        playerHome: {
          ...state.playerHome,
          ships: updatedShips,
        },
      };
      return updatedState;
    }),
  draggingEnd: () => set((state) => ({ ...state, dragging: undefined })),
  turnShip: (shipIndex) =>
    set((state) => {
      const updatedShips: IShip[] = [...state.playerHome.ships];
      const currDirection = updatedShips[shipIndex].direction;
      const updatedDirection: ICoord = {
        x: currDirection.x === 0 ? 1 : 0,
        y: currDirection.y === 0 ? 1 : 0,
      };
      let updatedStart: ICoord = updatedShips[shipIndex].coordStart;
      let updatedEnd: ICoord = {
        x:
          updatedShips[shipIndex].coordStart.x +
          updatedDirection.x * (updatedShips[shipIndex].length - 1),
        y:
          updatedShips[shipIndex].coordStart.y +
          updatedDirection.y * (updatedShips[shipIndex].length - 1),
      };
      if (9 < updatedEnd.x) {
        const shift = updatedEnd.x - 9;
        updatedStart = { x: updatedStart.x - shift, y: updatedStart.y };
        updatedEnd = { x: updatedEnd.x - shift, y: updatedEnd.y };
      }
      if (9 < updatedEnd.y) {
        const shift = updatedEnd.y - 9;
        updatedStart = { x: updatedStart.x, y: updatedStart.y - shift };
        updatedEnd = { x: updatedEnd.x, y: updatedEnd.y - shift };
      }

      updatedShips[shipIndex] = {
        ...updatedShips[shipIndex],
        direction: updatedDirection,
        coordStart: updatedStart,
        coordEnd: updatedEnd,
      };

      shipAdjacentToOther(updatedShips);

      const updatedState = {
        ...state,
        dragging: undefined,
        playerHome: {
          ...state.playerHome,
          ships: updatedShips,
        },
      };
      return updatedState;
    }),
  start: () =>
    set((state) => ({ ...state, inTurn: state.playerHome, started: true })),
  shootBoard: (id, coord) =>
    set((state) => {
      console.log("id:", id, coord);
      return state;
    }),
}));

export { useSeabattleStore };
