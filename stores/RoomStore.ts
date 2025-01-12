import type { Player } from "~/types/global";

export const useRoomStore = defineStore('room', {
  state: () => (
    {
      name: 'My Room',
      players: [
        {name: 'Player 1', color: { "name": "Emerald Green", "value": "#2E8B57" }, score: 12},
        {name: 'Player 2', color: { "name": "Alizarin", "value": "#e74c3c" }, score: 5},
        {name: 'Player 3', color: { "name": "Sunflower Yellow", "value": "#FFD700" }, score: 9},
        {name: 'Player 4', color: { "name": "Royal Blue", "value": "#4169E1" }, score: 26},
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