import type { Player, Color, Game, Rank } from "~/types/global";
import { v4 as uuidv4 } from 'uuid';
import { WinCondition } from "~/types/global";
import { useToast } from 'primevue/usetoast';

export const useRoomStore = defineStore('room', {
  state: () => (
    {
      currentGame: null as Game | null,
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
      const player: Player = {
        uuid: uuidv4(),
        name,
        color,
        score: 0
      }

      this.players.push(player);

      if (!this.currentGame) {
        return;
      }

      this.currentGame.scores[player.uuid] = this.currentGame.startScore;
    },
    removePlayer(playerUuid: string) {
      const player = this.players.find((player) => player.uuid === playerUuid);
      if (player) {
        this.players = this.players.filter((player) => player.uuid !== playerUuid);
      }
    },
    startGame(
      name: string,
      startScore: number,
      endingScore: number | null,
      winCondition: WinCondition,
      lowestPossibleScore: number | null
    ) {
      this.currentGame = {
        uuid: uuidv4(),
        name,
        startScore,
        endingScore,
        winCondition,
        lowestPossibleScore,
        scores: this.players.reduce((acc: Record<string, number>, player) => {
          acc[player.uuid] = startScore;
          return acc;
        }, {} as Record<string, number>),
        createdAt: new Date(),
        endedAt: null
      };
    },
    endGame() {
      if (this.currentGame) {
        this.currentGame.endedAt = new Date();
        this.calculateRanking(this.currentGame);
        this.games.push(this.currentGame);

        this.currentGame = null;
      }
    },
    resetGame() {
      if (this.currentGame !== null) {
        this.currentGame.scores = this.players.reduce((acc: Record<string, number>, player) => {
          acc[player.uuid] = this.currentGame.startScore;
          return acc;
        }, {} as Record<string, number>);
      }
    },
    calculateRanking(game: Game) {
      const rankings = this.players.map((player) => ({
        player,
        score: game.scores[player.uuid],
      }));

      const ranking = Object.groupBy(rankings, (player) => player.score);

      let scoreToAdd: number;

      if (game.winCondition === WinCondition.MostPoints) {
        scoreToAdd = this.players.length - Object.entries(ranking).length;
      } else {
        scoreToAdd = this.players.length - 1;
      }

      Object.entries(ranking).forEach(([, players], index) => {
        players?.forEach((player) => {
          const roomPlayer = this.players.find((p) => p.uuid === player.player.uuid);

          if (roomPlayer) {
            roomPlayer.score += scoreToAdd;
          }
        });
        if (game.winCondition === WinCondition.MostPoints) {
          scoreToAdd++;
        } else {
          scoreToAdd--;
        }
      });
    },
    incrementScore(player: Player) {
      if (!this.currentGame) {
        return;
      }

      if (this.currentGame.endingScore === null || this.currentGame.scores[player.uuid] !== this.currentGame.endingScore) {
        this.currentGame.scores[player.uuid]++;
      }

      if (
        this.currentGame.scores[player.uuid] === this.currentGame.endingScore) {
        this.endGame();
      }
    },
    decrementScore(player: Player) {
      if (!this.currentGame) {
        return;
      }

      if (this.currentGame.lowestPossibleScore === null
        || this.currentGame.scores[player.uuid] > this.currentGame.lowestPossibleScore
        && (this.currentGame.endingScore === null || this.currentGame.scores[player.uuid] !== this.currentGame.endingScore)) {
        this.currentGame.scores[player.uuid]--;
      }

      if (this.currentGame.scores[player.uuid] === this.currentGame.endingScore) {
        this.endGame();
      }
    },
    getPlayerScore (player: Player) {
      return this.currentGame?.scores[player.uuid];
    }
  },
  getters: {
    getLastCompletedGame: (state) => {
      return state.games
        .filter((game) => game.endedAt !== null) // Récupérer les parties terminées
        .sort((a, b) => new Date(b.endedAt!).getTime() - new Date(a.endedAt!).getTime())[0] || null; // Trier par date de fin décroissante
    },
  }
})