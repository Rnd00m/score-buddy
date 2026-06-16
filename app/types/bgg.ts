export interface BggGame {
  id: number;
  name: string;
  yearPublished: number | null;
}

export interface BggSearchItem {
  id: string;
  name: { type?: string; value: string } | { type?: string; value: string }[];
  yearpublished?: { value: string };
}

export interface BggSearchResponse {
  items?: {
    item?: BggSearchItem | BggSearchItem[];
  };
}