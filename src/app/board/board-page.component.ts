import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RetroBoard } from './model';
import { RetroBoardService } from './retro-board.service';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { UserService } from '../user.service';
import { NewBoardModalComponent } from './new-board-modal/new-board-modal.component';
import { AboutComponent } from '../about/about.component';

@Component({
  templateUrl: 'board-page.component.html',
  styleUrls: ['board-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardPage implements OnInit {
  selectedBoard$: Observable<RetroBoard> = this.route.paramMap
    .pipe(
      map((params) => params.get('id')),
      filter((id) => !!id),
      switchMap((id) => this.retroBoardService.getBoard$(id))
    )
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  publicRetroBoards$: Observable<RetroBoard[]> = this.retroBoardService.publicRetroBoards$;
  username$ = this.userService.username$;
  cardIndexes$ = this.selectedBoard$.pipe(map((board) => board.cards.map((card, i) => i)));

  constructor(
    private retroBoardService: RetroBoardService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private userService: UserService,
    public modalController: ModalController
  ) {}

  async ngOnInit() {
    if (!(await this.userService.currentUser())) {
      this.showLoginPopup();
    }
  }

  navigateToBoard(id: string) {
    this.navCtrl.navigateForward('/board/' + id);
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
    await alertDialog.present();
  }

  async showNewBoardModal() {
    const modal = await this.modalController.create({
      component: NewBoardModalComponent,
      cssClass: 'new-board-modal',
    });
    await modal.present();
  }

  async showAboutModal() {
    const modal = await this.modalController.create({
      component: AboutComponent,
      cssClass: 'about-modal',
    });
    await modal.present();
  }

  deleteBoard(id: string) {
    if (confirm('Soll dieses Board wirklich gelöscht werden?')) {
      this.retroBoardService.deleteBoard(id);
      this.navCtrl.navigateRoot('/board');
    }
  }
}
