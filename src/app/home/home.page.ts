import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RetroBoard, RetroCard } from './model';
import { RetroBoardService } from './retro-board.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  retroBoard$: Observable<RetroBoard> = this.retroBoardService.retroBoard$;
  retroBoards$: Observable<RetroBoard[]> = this.retroBoardService.retroBoards$;

  constructor(private retroBoardService: RetroBoardService, private alertController: AlertController) {}

  updateCard(card: RetroCard) {
    this.retroBoardService.updateCard(card);
  }

  selectBoard(id: string) {
    this.retroBoardService.selectBoard(id);
  }

  async createNewBoard() {
    const alert = await this.alertController.create({
      header: 'Neues Retro Board erstellen',
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
            this.retroBoardService
              .createNewBoard(input.title)
              .then((ref) => this.retroBoardService.selectBoard(ref.id));
          },
        },
      ],
    });
    alert.present();
  }

  deleteBoard(id: string) {
    this.retroBoardService.deleteBoard(id);
  }
}
