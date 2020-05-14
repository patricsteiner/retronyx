import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RetroCard, RetroCardItem } from '../model';
import { UserService } from '../../user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RetroBoardService } from '../retro-board.service';

@Component({
  selector: 'app-retro-card',
  templateUrl: './retro-card.component.html',
  styleUrls: ['./retro-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetroCardComponent implements OnInit, OnDestroy {
  @Input()
  boardId: string; // TODO fix, this is ugly

  @Input()
  cardIdx: number; // TODO fix, this is ugly

  @Input()
  retroCard: RetroCard;

  itemText: string;

  username: string;

  destroy$ = new Subject();

  constructor(private userService: UserService, private retroBoardService: RetroBoardService) {}

  ngOnInit() {
    this.userService.username$.pipe(takeUntil(this.destroy$)).subscribe((username) => {
      this.username = username;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleLike(itemIdx: number) {
    if (this.retroCard.items[itemIdx].likes.includes(this.username)) {
      this.unlike(itemIdx);
    } else {
      this.like(itemIdx);
    }
  }

  like(itemIdx: number) {
    this.retroCard.items[itemIdx].likes.push(this.username); // TODO refactor, this is just here so it visually updates immediately.
    this.retroBoardService.likeItem(this.boardId, this.cardIdx, itemIdx, this.username);
  }

  unlike(itemIdx: number) {
    this.retroCard.items[itemIdx].likes = this.retroCard.items[itemIdx].likes.filter((n) => n !== this.username); // TODO refactor, this is just here so it visually updates immediately.
    this.retroBoardService.unlikeItem(this.boardId, this.cardIdx, itemIdx, this.username);
  }

  private addItem(item: RetroCardItem) {
    const index = this.retroCard.items.findIndex((i) => i.text === item.text);
    if (index > -1) {
      if (!this.retroCard.items[index].likes.includes(this.username)) {
        this.like(index);
      }
    } else {
      this.retroCard.items.push(item); // TODO refactor, this is just here so it visually updates immediately.
      this.retroBoardService.addItem(this.boardId, this.cardIdx, item);
    }
  }

  deleteItem(itemIdx: number) {
    this.retroCard.items.splice(itemIdx, 1); // TODO refactor, this is just here so it visually updates immediately.
    this.retroBoardService.deleteItem(this.boardId, this.cardIdx, itemIdx);
  }

  submit() {
    if (this.itemText) {
      this.addItem({ text: this.itemText, user: this.username, likes: [] });
      this.itemText = '';
    }
  }

  toggleFlag(itemIdx: number) {
    if (this.retroCard.items[itemIdx].flag) {
      this.retroCard.items[itemIdx].flag = false; // TODO refactor, this is just here so it visually updates immediately.
      this.retroBoardService.unflagItem(this.boardId, this.cardIdx, itemIdx);
    } else {
      this.retroCard.items[itemIdx].flag = true; // TODO refactor, this is just here so it visually updates immediately.
      this.retroBoardService.flagItem(this.boardId, this.cardIdx, itemIdx);
    }
  }
}
