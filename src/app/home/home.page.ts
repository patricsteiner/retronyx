import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RetroBoard, RetroCard } from './model';
import { RetroBoardService } from './retro-board.service';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  selectedBoard$: Observable<RetroBoard> = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter((id) => !!id),
    switchMap((id) => this.retroBoards$.pipe(map((boards) => boards.find((board) => board.id === id))))
  );
  retroBoards$: Observable<RetroBoard[]> = this.retroBoardService.retroBoards$;
  username: string;

  constructor(
    private retroBoardService: RetroBoardService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private userService: UserService
  ) {}

  updateCard(boardId: string, cardIndex: number, card: RetroCard) {
    this.retroBoardService.updateCard(boardId, cardIndex, card);
  }

  navigateToBoard(id: string) {
    this.navCtrl.navigateForward('/home/' + id);
  }

  async createNewBoard() {
    this.showInputDialog('');
  }

  async showInputDialog(error: string) {
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
            if (!input.title) return false;
            this.retroBoardService.createNewBoard(input.title).then(
              (ref) => this.navigateToBoard(ref.id),
              () => {
                this.showInputDialog('Dieser Titel wird bereits verwendet');
              }
            );
          },
        },
      ],
    });
    alertDialog.present();
  }

  deleteBoard(id: string) {
    if (confirm('Soll dieses Board wirklich gelöscht werden?')) {
      this.retroBoardService.deleteBoard(id);
      this.navCtrl.navigateRoot('/home');
    }
  }

  login() {
    this.userService.login(this.username);
  }
}
