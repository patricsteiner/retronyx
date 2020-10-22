// @ts-ignore
import Timestamp = firebase.firestore.Timestamp;

export class RetroBoard {
  id?: string;
  createdAt?: Timestamp;
  createdBy: string;
  title: string;
  cards: RetroCard[];

  constructor(title: string, createdBy: string, template: string) {
    this.title = title;
    this.createdBy = createdBy;
    if (template.toLowerCase() === 'de') {
      this.cards = [
        { emoji: '😃', title: 'Positives' },
        { emoji: '😥', title: 'Negatives' },
        { emoji: '💡', title: 'Ideen' },
        { emoji: '🌷', title: 'Dankeschön' },
      ];
    } else if (template.toLowerCase() === 'ch') {
      this.cards = [
        { emoji: '😃', title: 'Das isch super gsi!' },
        { emoji: '😥', title: 'Hät chönne besser loufe' },
        { emoji: '💡', title: 'Ideeä' },
        { emoji: '🌷', title: 'Und es Merci geit a...' },
      ];
    } else {
      this.cards = [
        { emoji: '😃', title: 'What went well?' },
        { emoji: '😥', title: 'What could be improved?' },
        { emoji: '💡', title: 'Ideas' },
        { emoji: '🌷', title: 'Thank you' },
      ];
    }
  }
}

export interface RetroCard {
  title: string;
  emoji: string;
}

export interface RetroBoardEntry {
  id?: string;
  position?: number;
  cardIdx: number;
  text: string;
  likes: string[];
  user: string;
  flag?: boolean;
  deleted?: boolean;
}
