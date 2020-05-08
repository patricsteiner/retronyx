export interface RetroBoard {
  title: string;
  cards: RetroCard[];
}

export interface RetroCard {
  title: string;
  items: RetroCardItem[];
}

export interface RetroCardItem {
  text: string;
  likes?: number;
}
