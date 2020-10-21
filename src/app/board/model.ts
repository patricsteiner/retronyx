// @ts-ignore
import Timestamp = firebase.firestore.Timestamp;

export class RetroBoard {
  id: string;
  createdAt: Date | Timestamp;
  createdBy: string;
  title: string;
  cards: RetroCard[] = [
    { emoji: '😃', title: 'Positives', items: [] },
    { emoji: '😥', title: 'Negatives', items: [] },
    { emoji: '💡', title: 'Ideen', items: [] },
    { emoji: '🌷', title: 'Dankeschön', items: [] },
  ];

  constructor(title: string, createdBy: string) {
    this.title = title;
    this.createdAt = new Date();
    this.createdBy = createdBy;
  }
}

export interface RetroCard {
  title: string;
  emoji: string;
  items: RetroCardItem[];
}

export interface RetroCardItem {
  text: string;
  likes: string[];
  user?: string;
  flag?: boolean;
  deleted?: boolean;
}
