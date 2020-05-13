import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RetroCard, RetroCardItem } from '../model';
import { UserService } from '../../user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-retro-card',
  templateUrl: './retro-card.component.html',
  styleUrls: ['./retro-card.component.scss'],
})
export class RetroCardComponent implements OnInit, OnDestroy {
  @Input()
  items: RetroCardItem[];

  @Input()
  retroCard: RetroCard;

  @Output()
  cardUpdated = new EventEmitter<RetroCard>();

  itemText: string;

  username: string;

  destroy$ = new Subject();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.username$.pipe(takeUntil(this.destroy$)).subscribe((username) => {
      this.username = username;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleLike(index: number) {
    if (this.retroCard.items[index].likes.includes(this.username)) {
      this.unlike(index);
    } else {
      this.like(index);
    }
  }

  like(index: number) {
    const newItems = [...this.retroCard.items];
    newItems[index].likes = [...newItems[index].likes, this.username];
    const newCard = { ...this.retroCard, items: newItems };
    this.cardUpdated.emit(newCard);
  }

  unlike(index: number) {
    const newItems = [...this.retroCard.items];
    newItems[index].likes = newItems[index].likes.filter((u) => u !== this.username);
    const newCard = { ...this.retroCard, items: newItems };
    this.cardUpdated.emit(newCard);
  }

  private addItem(item: RetroCardItem) {
    const index = this.retroCard.items.findIndex((i) => i.text === item.text);
    if (index > -1) {
      if (!this.retroCard.items[index].likes.includes(this.username)) {
        this.like(index);
      }
    } else {
      const newItems = [...this.retroCard.items, item];
      const newCard = { ...this.retroCard, items: newItems };
      this.cardUpdated.emit(newCard);
    }
  }

  deleteItem(item: RetroCardItem) {
    const newItems = this.retroCard.items.filter((i) => i.text !== item.text);
    const newCard = { ...this.retroCard, items: newItems };
    this.cardUpdated.emit(newCard);
  }

  submit() {
    if (this.itemText) {
      this.addItem({ text: this.itemText, user: this.username, likes: [] });
      this.itemText = '';
    }
  }

  toggleFlag(index: number) {
    const newItems = [...this.retroCard.items];
    newItems[index].flag = !newItems[index].flag;
    const newCard = { ...this.retroCard, items: newItems };
    this.cardUpdated.emit(newCard);
  }
}
