export class RetroBoard {
  readonly id: string;
  readonly createdAt: Date;
  readonly title: string;
  readonly cards: RetroCard[] = [
    { title: '😃', items: [] },
    { title: '😥', items: [] },
    { title: '💡', items: [] },
    { title: '🌷', items: [] },
  ];

  constructor(title: string) {
    this.title = title;
    this.createdAt = new Date();
  }
}

export interface RetroCard {
  title: string;
  items: RetroCardItem[];
}

export interface RetroCardItem {
  text: string;
  likes?: number;
}
