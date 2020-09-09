import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RetroBoard } from './model';
import { RetroBoardService } from './retro-board.service';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { UserService } from '../user.service';

@Component({
  templateUrl: 'board-page.component.html',
  styleUrls: ['board-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardPage implements OnInit {
  showAlphaInfo = true;
  selectedBoard$: Observable<RetroBoard> = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter((id) => !!id),
    switchMap((id) => this.retroBoards$.pipe(map((boards) => boards.find((board) => board.id === id))))
  );
  retroBoards$: Observable<RetroBoard[]> = this.retroBoardService.retroBoards$;
  username$ = this.userService.username$;
  cardIndexes$ = this.selectedBoard$.pipe(map((board) => board.cards.map((card, i) => i)));

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
    const username = await this.username$.pipe(take(1)).toPromise();
    const alertDialog = await this.alertController.create({
      header: 'Wie ist dein Name?',
      subHeader: '',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: username,
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
}
