import { defineStore } from 'pinia';
import { Player } from 'components/models';

export const useGameStore = defineStore('game', {
  state: () => ({
    players: [
      {

        id: 1,
        name: 'Player 1',
        score: 100,
        color: 'red'
      },
      {
        id: 2,
        name: 'Player 2',
        score: 200,
        color: 'blue'
      }
    ] as Player[],
  }),
  actions: {
    increment(playerId: number) {
      const player = this.players.find((p) => p.id === playerId);

      if (player === undefined) {
        return;
      }

      player.score++;
    },
    decrement(playerId: number) {
      const player = this.players.find((p) => p.id === playerId);

      if (player === undefined) {
        return;
      }

      player.score--;
    },
  },
});
