import type {Player, Color, Game, GameScore} from "~/types/global";
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

    this.calculateRankings(this.currentGame);
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
      this.calculatePlayersEndScore(this.currentGame);
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
  cancelGame() {
    this.currentGame = null;
  },
  calculateRankings(game: Game) {
    const rankings = game.scores.sort((a, b) => {
      if (game.winCondition === WinCondition.MostPoints) {
        if (a.score > b.score) return -1;
        if (a.score < b.score) return 1;
      } else {
        if (a.score < b.score) return -1;
        if (a.score > b.score) return 1;
      }

      return 0;
    });

    let previousScore: number | null = null;
    rankings.forEach((score: GameScore, index) => {
      if (previousScore === score.score) {
        score.rank = rankings[index - 1].rank;
      } else {
        score.rank = index + 1;
      }

      previousScore = score.score;
    });
  },
  calculatePlayersEndScore(game: Game) {
    const playersNumber = game.scores.length;
    game.scores.forEach((score: GameScore) => {
      const player = this.players.find((player) => player.uuid === score.player.uuid);

      if (!player) return;

      player.score += playersNumber - score.rank;
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

    this.calculateRankings(this.currentGame);
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

    this.calculateRankings(this.currentGame);
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

    return state.currentGame.scores.filter(playerScore => playerScore.rank === 1) || null;
  },
  isGameFinished: (state): boolean => {
    if (state.currentGame === null) return false;

    if (state.currentGame.endingScore === null) return false;

    return state.currentGame.scores.some(playerScore => playerScore.score === state.currentGame.endingScore);
  }
}
})