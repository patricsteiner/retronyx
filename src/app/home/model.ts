export interface RetroBoard {
  happyCard: RetroCard;
  sadCard: RetroCard;
  ideaCard: RetroCard;
  flowerCard: RetroCard;
}

export interface RetroCard {
  items: RetroCardItem[];
}

export interface RetroCardItem {
  text: string;
  likes?: number;
}
