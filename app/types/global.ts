export enum WinCondition {
  MostPoints = 'Most',
  LeastPoints = 'Least',
}

export interface Color {
  name: string;
  value: string;
}

export interface Game {
  uuid: string;
  name: string
  startScore: number;
  endingScore: number | null;
  lowestPossibleScore: number | null;
  winCondition: WinCondition;
  winningRounds: number;
  scores: GameScore[];
  rounds: GameRound[];
  createdAt: Date;
  endedAt: Date | null;
}

export interface GameScore {
  player: Player;
  score: number;
  rank: number;
}

export interface GameRound {
  scores: GameScore[];
  endedAt: Date;
}

export interface Player {
  uuid: string;
  name: string;
  color: Color;
  score: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  color: Color;
}