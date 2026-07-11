import type {Player, Color, Game, GameScore, GameRound} from "~/types/global";
import { v4 as uuidv4 } from 'uuid';
import { WinCondition } from "~/types/global";

export const MAX_SCORE = 9_999_999_999;
export const MIN_SCORE = -MAX_SCORE;

// A shallow copy is enough: resetGame() always replaces currentGame.scores
// with brand-new GameScore objects rather than mutating existing ones, so a
// past round's snapshot is never retroactively altered by later rounds.
const buildRoundSnapshot = (game: Game): GameRound => ({
  scores: [...game.scores],
  endedAt: new Date(),
});

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
  storage: piniaPluginPersistedstate.localStorage()
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
    lowestPossibleScore: number | null,
    winningRounds: number = 1
  ) {
    this.currentGame = {
      uuid: uuidv4(),
      name,
      startScore,
      endingScore,
      winCondition,
      lowestPossibleScore,
      winningRounds,
      scores: this.players.map((player: Player) => {
        return {
          player: player,
          score: startScore,
          rank: 1
        }
      }),
      rounds: [],
      createdAt: new Date(),
      endedAt: null
    };
  },
  endGame() {
    if (this.currentGame) {
      (this.currentGame.rounds ??= []).push(buildRoundSnapshot(this.currentGame));
      this.currentGame.endedAt = new Date();
      this.calculatePlayersEndScore(this.currentGame);
      this.games.push(this.currentGame);

      this.currentGame = null;
    }
  },
  endRound() {
    if (this.currentGame) {
      (this.currentGame.rounds ??= []).push(buildRoundSnapshot(this.currentGame));
      this.resetGame();
    }
  },
  resetGame() {
    if (this.currentGame) {
      this.currentGame.scores = this.players.map((player: Player) => {
        return {
          player: player,
          score: this.currentGame?.startScore || 0,
          rank: 1
        }
      });
    }
  },
  deleteRoom() {
    this.currentGame = null;
    this.games = [];
    this.players = [];
  },
  resetRoom() {
    this.currentGame = null;
    this.games = [];
    this.players.forEach((player) => player.score = 0);
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
    let previousRank = 1;
    rankings.forEach((score: GameScore, index) => {
      score.rank = previousScore === score.score ? previousRank : index + 1;

      previousScore = score.score;
      previousRank = score.rank;
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

    if (playerScore.score < MAX_SCORE
      && (this.currentGame.endingScore === null || playerScore.score !== this.currentGame.endingScore)) {
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

    if (playerScore.score > MIN_SCORE
      && (this.currentGame.lowestPossibleScore === null
      || playerScore.score > this.currentGame.lowestPossibleScore
      && (this.currentGame.endingScore === null || playerScore.score !== this.currentGame.endingScore))) {
      playerScore.score--;
    }

    this.calculateRankings(this.currentGame);
  },
  setScore(player: Player, score: number): void {
    if (!this.currentGame) {
      return;
    }

    const playerScore = this.getPlayerScore(player);

    if (!playerScore) {
      return;
    }

    const clampedScore = Math.min(Math.max(score, MIN_SCORE), MAX_SCORE);

    playerScore.score = this.currentGame.lowestPossibleScore !== null
      ? Math.max(clampedScore, this.currentGame.lowestPossibleScore)
      : clampedScore;

    this.calculateRankings(this.currentGame);
  },
  getPlayerScore (player: Player): GameScore | null {
    return this.currentGame?.scores.find((score) => score.player.uuid === player.uuid) || null;
  },
  reorderPlayers(oldIndex: number, newIndex: number) {
    const [player] = this.players.splice(oldIndex, 1);
    if (!player) return;

    this.players.splice(newIndex, 0, player);
  }
},
getters: {
  getLastCompletedGame: (state) => {
    return state.games
      .filter((game) => game.endedAt !== null)
      .sort((a, b) => new Date(b.endedAt!).getTime() - new Date(a.endedAt!).getTime())[0] || null;
  },
  winners: (state): GameScore[] | null => {
    if (state.currentGame === null) return null;

    return state.currentGame.scores.filter(playerScore => playerScore.rank === 1) || null;
  },
  isGameFinished: (state): boolean => {
    if (state.currentGame === null) return false;

    if (state.currentGame.endingScore === null) return false;

    return state.currentGame.scores.some(playerScore => playerScore.score === state.currentGame?.endingScore);
  },
  currentRoundWinsTally: (state): Record<string, number> => {
    const tally: Record<string, number> = {};
    if (state.currentGame === null) return tally;

    const creditRound = (scores: GameScore[]) => {
      scores.filter(playerScore => playerScore.rank === 1).forEach(playerScore => {
        tally[playerScore.player.uuid] = (tally[playerScore.player.uuid] ?? 0) + 1;
      });
    };

    (state.currentGame.rounds ?? []).forEach(round => creditRound(round.scores));
    creditRound(state.currentGame.scores);

    return tally;
  },
  isCurrentRoundDecisive(): boolean {
    if (this.currentGame === null) return false;

    const winningRounds = this.currentGame.winningRounds ?? 1;
    if (winningRounds <= 1) return true;

    return Object.values(this.currentRoundWinsTally).some(count => count >= winningRounds);
  }
}
})