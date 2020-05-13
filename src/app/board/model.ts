export class RetroBoard {
  readonly id: string;
  readonly createdAt: Date;
  readonly title: string;
  readonly cards: RetroCard[] = [
    { emoji: '😃', items: [] },
    { emoji: '😥', items: [] },
    { emoji: '💡', items: [] },
    { emoji: '🌷', items: [] },
  ];

  constructor(title: string) {
    this.title = title;
    this.createdAt = new Date();
  }
}

export interface RetroCard {
  emoji: string;
  items: RetroCardItem[];
}

export interface RetroCardItem {
  text: string;
  likes?: number;
  user?: string;
}
