import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { colors, Player } from 'components/models';

const PLAYERS_LOCAL_STORAGE_KEY = 'players'

const getDefaultPlayers = (): Player[] => ([
  {
    id: 1,
    name: 'Player 1',
    score: 100,
    color: colors[0]
  },
  {
    id: 2,
    name: 'Player 2',
    score: 200,
    color: colors[3]
  },
  {
    id: 3,
    name: 'Player 3',
    score: 300,
    color: colors[5]
  },
  {
    id: 4,
    name: 'Player 4',
    score: 400,
    color: colors[7]
  }
]);

const getPlayers = () => {
  const players = LocalStorage.getItem(PLAYERS_LOCAL_STORAGE_KEY)

  console.log('players', players);
  console.log('players', players ? players : getDefaultPlayers());

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
