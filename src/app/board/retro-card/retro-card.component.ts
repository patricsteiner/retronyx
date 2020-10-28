import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { RetroBoardEntry, RetroCard, User } from '../model';
import { AuthService } from '../../auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BoardService } from '../board.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-retro-card',
  templateUrl: './retro-card.component.html',
  styleUrls: ['./retro-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetroCardComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  retroCard: RetroCard;

  @Input()
  entries: RetroBoardEntry[];

  @Input()
  boardId: string; // TODO fix, this is ugly

  @Input()
  cardIdx: number; // TODO fix, this is ugly

  entryText: string;

  user: User = { id: null, name: null };

  destroy$ = new Subject();

  constructor(
    private userService: AuthService,
    private retroBoardService: BoardService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.userService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (!!user) {
        this.user = user;
      }
    });
  }

  ngOnChanges() {
    this.entries.sort((a, b) => {
      if (a.position !== undefined && b.position !== undefined) return a.position - b.position;
      else return 99999;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleLike(entryId: string) {
    if (this.entries.find((e) => e.id === entryId)?.likes.includes(this.user.name)) {
      this.retroBoardService.unlikeEntry(this.boardId, entryId, this.user.name);
    } else {
      this.retroBoardService.likeEntry(this.boardId, entryId, this.user.name);
    }
  }

  private addEntry(item: RetroBoardEntry) {
    this.retroBoardService.addEntry(this.boardId, item);
  }

  deleteItem(entryId: string) {
    this.retroBoardService.deleteEntry(this.boardId, entryId);
  }

  submit() {
    this.entryText = this.entryText.trim();
    if (this.entryText) {
      this.addEntry({
        text: this.entryText,
        user: this.user,
        likes: [],
        cardIdx: this.cardIdx,
        position: this.entries.length,
      });
      this.entryText = '';
    }
  }

  toggleFlag(entryId: string) {
    if (this.entries.find((e) => e.id === entryId)?.flag) {
      this.retroBoardService.unflagEntry(this.boardId, entryId);
    } else {
      this.retroBoardService.flagEntry(this.boardId, entryId);
    }
  }

  updateCardTitle(title: string, emoji: string) {
    this.retroBoardService.updateCardTitle(this.boardId, this.cardIdx, title, emoji);
  }

  async showEditCardPopup(title: string, emoji: string) {
    const alertDialog = await this.alertController.create({
      header: 'Adjust card',
      // subHeader: error,
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Please enter a title...',
          value: title,
        },
        {
          name: 'emoji',
          type: 'text',
          placeholder: 'Optionally add an emoji...',
          value: emoji,
        },
      ],
      buttons: [
        {
          text: 'Abort',
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

  async showHint(event) {
    event.preventDefault();
    const toast = await this.toastController.create({
      message: 'Slide the item right or left for additional actions 🐱‍👤',
      duration: 2000,
      color: 'tertiary',
      cssClass: 'toast',
    });
    toast.present();
  }
}
