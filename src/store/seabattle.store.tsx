import { create } from "zustand";
import { IPlayer } from "../types";
import { createPlayer } from "./player";

interface SeabattleState {
  started: boolean;
  ended: boolean;
  inTurn: IPlayer | undefined;
  playerHome: IPlayer;
  playerAway: IPlayer;
  start: () => void;
}

const useSeabattleStore = create<SeabattleState>()((set) => ({
  started: false,
  ended: false,
  inTurn: undefined,
  playerHome: createPlayer(1, "Player1"),
  playerAway: createPlayer(2, "Player2"),
  start: () => set((state) => ({ ...state, started: true })),
}));

export { useSeabattleStore };
