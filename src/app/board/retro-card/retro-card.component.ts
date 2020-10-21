import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RetroCard, RetroCardItem } from '../model';
import { UserService } from '../../user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RetroBoardService } from '../retro-board.service';
import { AlertController } from '@ionic/angular';

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

  constructor(
    private userService: UserService,
    private retroBoardService: RetroBoardService,
    private alertController: AlertController,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

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
    const duplicateIdx = this.retroCard.items.findIndex((i) => i.text === item.text && !i.deleted);
    if (duplicateIdx > -1) {
      if (!this.retroCard.items[duplicateIdx].likes.includes(this.username)) {
        this.like(duplicateIdx);
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
    this.itemText = this.itemText.trim();
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

  updateCardTitle(title: string, emoji: string) {
    this.retroCard.title = title; // TODO refactor, this is just here so it visually updates immediately.
    this.retroCard.emoji = emoji.substring(0, 4); // TODO refactor, this is just here so it visually updates immediately.
    this.changeDetectorRef.detectChanges();
    this.retroBoardService.updateCardTitle(this.boardId, this.cardIdx, title, emoji);
  }

  async showEditCardPopup(title: string, emoji: string) {
    const alertDialog = await this.alertController.create({
      header: 'Karte anpassen',
      // subHeader: error,
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Bitte einen Titel eingeben...',
          value: title,
        },
        {
          name: 'emoji',
          type: 'text',
          placeholder: 'Optional ein Emoji einfügen...',
          value: emoji,
        },
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'OK',
          handler: (input) => {
            if (!input.title || !input.title.trim() || (input.title === title && input.emoji === emoji)) {
              return false;
            }
            this.updateCardTitle(input.title, input.emoji);
          },
        },
      ],
    });
    alertDialog.present();
  }
}
