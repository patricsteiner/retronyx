import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RetroCard, RetroCardItem } from '../model';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-retro-card',
  templateUrl: './retro-card.component.html',
  styleUrls: ['./retro-card.component.scss'],
})
export class RetroCardComponent {
  @Input()
  items: RetroCardItem[];

  @Input()
  retroCard: RetroCard;

  @Output()
  cardUpdated = new EventEmitter<RetroCard>();

  itemText: string;

  constructor(private userService: UserService) {}

  like(index: number) {
    const newItems = [...this.retroCard.items];
    if (newItems[index].likes) {
      newItems[index].likes++;
    } else {
      newItems[index].likes = 1;
    }
    const newCard = { ...this.retroCard, items: newItems };
    this.cardUpdated.emit(newCard);
  }

  private addItem(item: RetroCardItem) {
    const index = this.retroCard.items.findIndex((i) => i.text === item.text);
    if (index > -1) {
      this.like(index);
    } else {
      const newItems = [...this.retroCard.items, item];
      const newCard = { ...this.retroCard, items: newItems };
      this.cardUpdated.emit(newCard);
    }
  }

  private deleteItem(item: RetroCardItem) {
    const newItems = this.retroCard.items.filter((i) => i.text !== item.text);
    const newCard = { ...this.retroCard, items: newItems };
    this.cardUpdated.emit(newCard);
  }

  async submit() {
    if (this.itemText) {
      this.addItem({ text: this.itemText, user: await this.userService.currentUser() });
      this.itemText = '';
    }
  }
}
