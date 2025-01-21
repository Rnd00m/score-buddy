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
  scores: Record<number, number> // Map of player index to score
  createdAt: Date;
  endedAt: Date | null;
}

export interface Player {
  uuid: string;
  name: string;
  color: Color;
  score: number;
}