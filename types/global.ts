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
  scores: GameScore[];
  createdAt: Date;
  endedAt: Date | null;
}

export interface GameScore {
  player: Player;
  score: number;
  rank: number;
}

export interface Player {
  uuid: string;
  name: string;
  color: Color;
  score: number;
}

export type Rank = {
  player: Player;
  score: number; // Score final
};