import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { Player } from 'components/models';

const PLAYERS_LOCAL_STORAGE_KEY = 'settings'

const getDefaultPlayers = (): Player[] => ([
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
]);

const getPlayers = () => {
  const players = LocalStorage.getItem(PLAYERS_LOCAL_STORAGE_KEY)

  return players ? players : getDefaultPlayers()
}

export const useGameStore = defineStore('game', {
  state: () => ({
    players: getPlayers() as Player[]
  }),
  actions: {
    increment(playerId: number) {
      const player = this.players.find((p) => p.id === playerId);

      if (player === undefined) {
        return;
      }

      player.score++;

      LocalStorage.set(PLAYERS_LOCAL_STORAGE_KEY, this.players)
    },
    decrement(playerId: number) {
      const player = this.players.find((p) => p.id === playerId);

      if (player === undefined) {
        return;
      }

      player.score--;

      LocalStorage.set(PLAYERS_LOCAL_STORAGE_KEY, this.players)
    }
  }
});
