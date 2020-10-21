import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RetroBoard } from './model';
import { BoardService } from './board.service';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { UserService } from '../user.service';
import { NewBoardModalComponent } from './new-board-modal/new-board-modal.component';
import { AboutModalComponent } from '../about-modal/about-modal.component';

@Component({
  templateUrl: 'board-page.component.html',
  styleUrls: ['board-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardPage implements OnInit {
  board$: Observable<RetroBoard> = this.route.paramMap
    .pipe(
      map((params) => params.get('id')),
      filter((id) => !!id),
      switchMap((id) => this.retroBoardService.getBoard$(id))
    )
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  username$ = this.userService.username$;
  cardIndexes$ = this.board$.pipe(map((board) => board.cards.map((card, i) => i)));

  constructor(
    private retroBoardService: BoardService,
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

  async showLoginPopup() {
    const username = await this.username$.pipe(take(1)).toPromise();
    const alertDialog = await this.alertController.create({
      header: "What's your name?",
      subHeader: '',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: username,
          placeholder: 'Please enter your name...',
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
            if (!input.name || !input.name.trim()) {
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
      component: AboutModalComponent,
      cssClass: 'about-modal',
    });
    await modal.present();
  }
}
