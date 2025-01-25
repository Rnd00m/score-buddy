import type {Player, Color, Game, Rank, GameScore} from "~/types/global";
import { v4 as uuidv4 } from 'uuid';
import { WinCondition } from "~/types/global";

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

    this.currentGame.scores.push({
      player,
      score: this.currentGame.startScore,
      rank: 1
    });
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
      scores: this.players.map((player: Player) => {
        return {
          player: player,
          score: startScore,
          rank: 1
        }
      }),
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
    if (this.currentGame) {
      this.currentGame.scores = this.players.map((player: Player) => {
        return {
          player: player,
          score: this.currentGame.startScore,
          rank: 1
        }
      });
    }
  },
  calculateRanking(game: Game) {
    const rankings = this.players.map((player) => ({
      player,
      score: game.scores.find((score) => score.player.uuid === player.uuid)?.score || 0,
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

    const playerScore = this.getPlayerScore(player);

    if (!playerScore) {
      return;
    }

    if (this.currentGame.endingScore === null || playerScore.score !== this.currentGame.endingScore) {
      playerScore.score++;
    }
  },
  decrementScore(player: Player): void {
    if (!this.currentGame) {
      return;
    }

    const playerScore = this.getPlayerScore(player);

    if (!playerScore) {
      return;
    }

    if (this.currentGame.lowestPossibleScore === null
      || playerScore.score > this.currentGame.lowestPossibleScore
      && (this.currentGame.endingScore === null || playerScore.score !== this.currentGame.endingScore)) {
      playerScore.score--;
    }
  },
  getPlayerScore (player: Player): GameScore | null {
    return this.currentGame?.scores.find((score) => score.player.uuid === player.uuid) || null;
  }
},
getters: {
  getLastCompletedGame: (state) => {
    return state.games
      .filter((game) => game.endedAt !== null) // Récupérer les parties terminées
      .sort((a, b) => new Date(b.endedAt!).getTime() - new Date(a.endedAt!).getTime())[0] || null; // Trier par date de fin décroissante
  },
  winners: (state): GameScore[] | null => {
    if (state.currentGame === null) return null;

    if (state.currentGame.endingScore === null) return null;

    return state.currentGame.scores.filter(playerScore => playerScore.score === state.currentGame.endingScore) || null;
  },
}
})