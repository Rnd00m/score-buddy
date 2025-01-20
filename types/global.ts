export interface Color {
  name: string;
  value: string;
}

export interface Game {
  uuid: string;
  name: string;
  scores: Record<number, number> // Map of player index to score
}

export interface Player {
  uuid: string;
  name: string;
  color: Color;
  score: number;
}