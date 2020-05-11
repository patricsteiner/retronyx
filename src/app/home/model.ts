export class RetroBoard {
  id: string;
  readonly title: string;
  readonly cards = [
    // TODO readonly weg?
    { title: 'happy', items: [] },
    { title: 'sad', items: [] },
    { title: 'idea', items: [] },
    { title: 'flower' },
  ];

  constructor(title: string) {
    this.title = title;
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
