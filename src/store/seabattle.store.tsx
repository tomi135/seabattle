import { create } from "zustand";
import { ICoord, IDragging, IPlayer, IShip } from "../types";
import { createPlayer } from "./player";
import { coordSum } from "../util";
import { shipAdjacentToOther } from "../game/pre-game-logic";
import {
  canShoot,
  changeTurn,
  didGameEnd,
  putSafeSquaresAroundShip,
  shipHit,
  updateBoard,
  updateHitObject,
} from "../game/game-logic";

interface SeabattleState {
  started: boolean;
  ended: boolean;
  inTurn: number | undefined;
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
    set((state) => {
      return { ...state, inTurn: state.playerHome.playerId, started: true };
    }),
  shootBoard: (id, coord) =>
    set((state) => {
      console.log("id:", id, coord);
      if (id !== state.inTurn || !state.started || state.ended) return state;

      const currentPlayer = id === 1 ? state.playerHome : state.playerAway;
      const opponentPlayer = id === 1 ? state.playerAway : state.playerHome;

      if (!canShoot(currentPlayer.boardOpponent[coord.y][coord.x]))
        return state;

      let nextInTurn: number | undefined = state.inTurn;
      let ended: boolean = state.ended;
      let updatedShips = opponentPlayer.ships;
      let lastHit = currentPlayer.lastHit;

      let boardsUpdated = updateBoard(
        opponentPlayer.board,
        currentPlayer.boardOpponent,
        coord
      );

      if (!boardsUpdated.hit) {
        lastHit = {
          ...lastHit,
          miss: true,
        };
        nextInTurn = changeTurn(state.inTurn, currentPlayer, opponentPlayer);
      } else {
        lastHit = updateHitObject(lastHit, coord);
        const { updatedShipsTemp, hitShipIndex } = shipHit(
          coord,
          opponentPlayer.ships
        );

        updatedShips = updatedShipsTemp;
        if (
          hitShipIndex !== -1 &&
          updatedShips[hitShipIndex].hitSquares ===
            updatedShips[hitShipIndex].length
        ) {
          lastHit = {};
          console.log(
            "Put safe around ship, updated board:",
            boardsUpdated.opponent
          );
          boardsUpdated = putSafeSquaresAroundShip(
            boardsUpdated,
            updatedShips[hitShipIndex]
          );
          ended = didGameEnd(updatedShips);
          if (ended) nextInTurn = undefined;
        }
      }

      const updatedCurrentPlayer = {
        ...currentPlayer,
        boardOpponent: boardsUpdated.opponent,
        lastHit: lastHit,
      };
      const udpatedOpponentPlayer = {
        ...opponentPlayer,
        board: boardsUpdated.currentPlayer,
        ships: updatedShips,
      };

      return {
        ...state,
        inTurn: nextInTurn,
        ended: ended,
        playerHome: id === 1 ? updatedCurrentPlayer : udpatedOpponentPlayer,
        playerAway: id === 1 ? udpatedOpponentPlayer : updatedCurrentPlayer,
      };
    }),
}));

export { useSeabattleStore };
