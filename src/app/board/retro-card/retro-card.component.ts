import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { RetroBoardEntry, RetroCard, User } from '../model';
import { AuthService } from '../../core/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BoardService } from '../board.service';
import { AlertController } from '@ionic/angular';
import { HighlightService } from '../highlight.service';

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
  highlightedUserId: string;

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
    public highlightService: HighlightService
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

  deleteEntry(entryId: string) {
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

  updateEntry(entryId: string, entryText: string) {
    this.retroBoardService.updateEntry(this.boardId, entryId, entryText);
  }

  async showEditCardPopup(title: string, emoji: string) {
    const alertDialog = await this.alertController.create({
      header: 'Adjust card',
      cssClass: 'editCardPopup',
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
            if (!input.title || !input.title.trim()) {
              return false;
            }
            if (input.title !== title || input.emoji !== emoji) {
              this.updateCardTitle(input.title, input.emoji);
            }
          },
        },
      ],
    });
    alertDialog.present();
  }

  async showEditEntryPopup(entryId: string, entryText: string) {
    const alertDialog = await this.alertController.create({
      header: 'Edit text',
      cssClass: 'editEntryPopup',
      inputs: [
        {
          name: 'text',
          type: 'textarea',
          placeholder: 'What do you want to tell the world?',
          value: entryText,
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
            if (!input.text || !input.text.trim()) {
              return false;
            }
            if (input.text !== entryText) {
              this.updateEntry(entryId, input.text);
            }
          },
        },
      ],
    });
    alertDialog.present();
  }

  async showSlidingOptions(event, slidingItem) {
    event.preventDefault();
    console.log(slidingItem);
    if ((await slidingItem.getOpenAmount()) === 0) {
      slidingItem.open('end');
    } else {
      slidingItem.close();
    }
  }
}
