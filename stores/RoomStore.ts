import type { Player } from "~/types/global";

export const useRoomStore = defineStore('room', {
  state: () => (
    {
      name: 'My Room',
      players: [
        {name: 'Player 1', color: {name: 'Green Sea', value: '#16a085'}, score: 12},
        {name: 'Player 2', color: {name: 'Alizarin', value: '#e74c3c'}, score: 5},
        {name: 'Player 3', color: {name: 'Orange', value: '#f39c12'}, score: 9},
        {name: 'Player 4', color: {name: 'Amethyst', value: '#9b59b6'}, score: 26},
      ]
    }
  ),
  actions: {
    addPlayer(player: Player) {
      this.players.push(player);
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