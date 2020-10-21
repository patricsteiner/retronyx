// @ts-ignore
import Timestamp = firebase.firestore.Timestamp;

export class RetroBoard {
  id: string;
  createdAt: Date | Timestamp;
  createdBy: string;
  title: string;
  cards: RetroCard[];

  constructor(title: string, createdBy: string, template: string) {
    this.title = title;
    this.createdAt = new Date();
    this.createdBy = createdBy;
    if (template.toLowerCase() === 'de') {
      this.cards = [
        { emoji: '😃', title: 'Positives', items: [] },
        { emoji: '😥', title: 'Negatives', items: [] },
        { emoji: '💡', title: 'Ideen', items: [] },
        { emoji: '🌷', title: 'Dankeschön', items: [] },
      ];
    } else if (template.toLowerCase() === 'ch') {
      this.cards = [
        { emoji: '😃', title: 'Das isch super gsi!', items: [] },
        { emoji: '😥', title: 'Hät chönne besser loufe', items: [] },
        { emoji: '💡', title: 'Ideeä', items: [] },
        { emoji: '🌷', title: 'Und es Merci geit a...', items: [] },
      ];
    } else {
      this.cards = [
        { emoji: '😃', title: 'What went well?', items: [] },
        { emoji: '😥', title: 'What could be improved?', items: [] },
        { emoji: '💡', title: 'Ideas', items: [] },
        { emoji: '🌷', title: 'Thank you', items: [] },
      ];
    }
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
