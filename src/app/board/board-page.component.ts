import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RetroBoard, RetroCard } from './model';
import { RetroBoardService } from './retro-board.service';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { UserService } from '../user.service';

@Component({
  templateUrl: 'board-page.component.html',
  styleUrls: ['board-page.component.scss'],
})
export class BoardPage implements OnInit, OnDestroy {
  selectedBoard$: Observable<RetroBoard> = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter((id) => !!id),
    switchMap((id) => this.retroBoards$.pipe(map((boards) => boards.find((board) => board.id === id))))
  );
  retroBoards$: Observable<RetroBoard[]> = this.retroBoardService.retroBoards$;
  username: string;
  private destroy$ = new Subject();

  constructor(
    private retroBoardService: RetroBoardService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private userService: UserService
  ) {}

  async ngOnInit() {
    if (!(await this.userService.currentUser())) {
      this.showLoginPopup();
    }
    this.userService.username$.pipe(takeUntil(this.destroy$)).subscribe((username) => (this.username = username));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateCard(boardId: string, cardIndex: number, card: RetroCard) {
    this.retroBoardService.updateCard(boardId, cardIndex, card);
  }

  navigateToBoard(id: string) {
    this.navCtrl.navigateForward('/board/' + id);
  }

  async createNewBoard() {
    this.showNewBoardPopup('');
  }

  async showNewBoardPopup(error: string) {
    const alertDialog = await this.alertController.create({
      header: 'Neues Retro Board erstellen',
      subHeader: error,
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Board Titel eingeben...',
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
            if (!input.title) {
              return false;
            }
            this.retroBoardService.createNewBoard(input.title).then(
              (ref) => this.navigateToBoard(ref.id),
              () => {
                this.showNewBoardPopup('Dieser Titel wird bereits verwendet');
              }
            );
          },
        },
      ],
    });
    alertDialog.present();
  }

  async showLoginPopup() {
    const alertDialog = await this.alertController.create({
      header: 'Wie ist dein Name?',
      subHeader: '',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Bitte Namen eingeben...',
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
            if (!input.name) {
              return false;
            }
            this.userService.login(input.name);
          },
        },
      ],
    });
    alertDialog.present();
  }

  deleteBoard(id: string) {
    if (confirm('Soll dieses Board wirklich gelöscht werden?')) {
      this.retroBoardService.deleteBoard(id);
      this.navCtrl.navigateRoot('/board');
    }
  }

  async login() {
    await this.userService.login(this.username);
  }
}
