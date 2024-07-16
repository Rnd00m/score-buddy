import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { Color, colors, Player } from 'components/models';

const PLAYERS_LOCAL_STORAGE_KEY = 'players';

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
  const players = LocalStorage.getItem(PLAYERS_LOCAL_STORAGE_KEY);

  return players ? players : getDefaultPlayers();
};

export const useGameStore = defineStore('game', {
  state: () => ({
    players: getPlayers() as Player[]
  }),
  actions: {
    getPlayerFromId (playerId: number): Player {
      const player = this.players.find((p) => p.id === playerId);

      if (player === undefined) {
        throw new Error(`Player with id ${playerId} not found`);
      }

      return player;
    },
    updatePlayerColor(playerId: number, color: Color) {
      const player= this.getPlayerFromId(playerId);

      player.color = color;

      LocalStorage.set(PLAYERS_LOCAL_STORAGE_KEY, this.players);
    },
    incrementPlayerScore(playerId: number) {
      const player= this.getPlayerFromId(playerId);

      player.score++;

      LocalStorage.set(PLAYERS_LOCAL_STORAGE_KEY, this.players);
    },
    decrementPlayerScore(playerId: number) {
      const player= this.getPlayerFromId(playerId);

      player.score--;

      LocalStorage.set(PLAYERS_LOCAL_STORAGE_KEY, this.players);
    }
  },
});
