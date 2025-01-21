import type { Player, Color, Game } from "~/types/global";
import { v4 as uuidv4 } from 'uuid';

export const useRoomStore = defineStore('room', {
  state: () => (
    {
      games: [] as Game[],
      players: [] as Player[]
    }
  ),
  persist: {
    key: 'roomStore',
    storage: localStorage
  },
  actions: {
    addPlayer(name: string, color: Color) {
      this.players.push({
        uuid: uuidv4(),
        name,
        color,
        score: 0
      });
    },
    removePlayer(playerUuid: string) {
      const player = this.players.find((player) => player.uuid === playerUuid);
      if (player) {
        this.players = this.players.filter((player) => player.uuid !== playerUuid);
      }
    },
    startGame(name: string) {
      const newGame: Game = {
        uuid: uuidv4(),
        name: name,
        scores: this.players.reduce((acc: Record<string, number>, player) => {
          acc[player.uuid] = 0;
          return acc;
        }, {} as Record<number, number>),
        createdAt: new Date(),
        endedAt: null
      };
      this.games.push(newGame);
    },
    incrementScore(player: Player) {
      player.score++;
    },
    decrementScore(player: Player) {
      if (player.score > 0) {
        player.score--;
      }
    }
  },
  getters: {
    getActiveGame: (state) => {
      return state.games.find((game) => game.endedAt === null) || null;
    }
  }
})