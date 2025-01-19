import type { Player, Color, Game } from "~/types/global";
import { nanoid } from "nanoid";

export const useRoomStore = defineStore('room', {
  state: () => (
    {
      games: [] as Game[],
      players: [/*
        {id: nanoid(), name: 'Player 1', color: { "name": "Emerald Green", "value": "#2E8B57" }, score: 12},
        {id: nanoid(), name: 'Player 2', color: { "name": "Alizarin", "value": "#e74c3c" }, score: 5},
        {id: nanoid(), name: 'Player 3', color: { "name": "Sunflower Yellow", "value": "#FFD700" }, score: 9},
        {id: nanoid(), name: 'Player 4', color: { "name": "Royal Blue", "value": "#4169E1" }, score: 26},
      */]
    }
  ),
  actions: {
    addPlayer(name: string, color: Color) {
      this.players.push({
        id: nanoid(),
        name,
        color,
        score: 0
      });
    },
    removePlayer(playerId: string) {
      const player = this.players.find((player) => player.id === playerId);
      if (player) {
        this.players = this.players.filter((player) => player.id !== playerId);
      }
    },
    startGame(name: string) {
      const newGame: Game = {
        id: nanoid(),
        name: name,
        scores: this.players.reduce((acc, player) => {
          acc[player.id] = 0;
          return acc;
        }, {} as Record<number, number>),
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
})