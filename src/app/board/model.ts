// @ts-ignore
import Timestamp = firebase.firestore.Timestamp;

export class RetroBoard {
  readonly id: string;
  readonly createdAt: Date | Timestamp;
  readonly title: string;
  readonly cards: RetroCard[] = [
    { emoji: '😃', title: 'Positives', items: [] },
    { emoji: '😥', title: 'Negatives', items: [] },
    { emoji: '💡', title: 'Ideen', items: [] },
    { emoji: '🌷', title: 'Dankeschön', items: [] },
  ];

  constructor(title: string) {
    this.title = title;
    this.createdAt = new Date();
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
