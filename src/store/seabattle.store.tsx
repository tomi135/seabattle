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
  start: () => void;
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
  start: () => set((state) => ({ ...state, started: true })),
}));

export { useSeabattleStore };
