import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { Participant, RetroBoard, RetroBoardEntry, User } from './model';
import { BoardService } from './board.service';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { NewBoardModalComponent } from './new-board-modal/new-board-modal.component';
import { AboutModalComponent } from '../about-modal/about-modal.component';

@Component({
  templateUrl: 'board-page.component.html',
  styleUrls: ['board-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardPage implements OnInit, OnDestroy {
  board$: Observable<RetroBoard> = this.boardService.board$;
  entries$: Observable<RetroBoardEntry[]> = this.boardService.entries$;
  participants$: Observable<Participant[]> = this.boardService.participants$;
  user$: Observable<User> = this.userService.user$;
  isDone$: Observable<boolean> = combineLatest([this.participants$, this.user$]).pipe(
    filter(([participants, user]) => !!participants && !!user),
    map(([participants, user]) => {
      const participant = participants.find((p) => p.user.id === user.id);
      return participant?.done;
    })
  );

  destroy$ = new Subject();

  constructor(
    private boardService: BoardService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private userService: AuthService,
    private modalController: ModalController
  ) {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        filter((id) => !!id),
        tap(async () => {
          if (!(await this.userService.isSignedIn())) {
            this.showLoginPopup();
          }
        })
      )
      .subscribe(this.boardService.boardIdSubject);
  }

  ngOnInit() {
    combineLatest([this.board$, this.user$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([board, user]) => {
        if (!!board && !!user && user.name) {
          this.boardService.addOrSetParticipant(board.id, { user });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  entriesForCard(cardIdx: number): Observable<RetroBoardEntry[]> {
    return this.entries$.pipe(map((entries) => entries.filter((entry) => entry.cardIdx === cardIdx)));
  }

  async showLoginPopup() {
    const user = await this.userService.currentUser();
    const alertDialog = await this.alertController.create({
      header: "What's your name?",
      subHeader: '',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: user?.name,
          placeholder: 'Please enter your name...',
        },
      ],
      buttons: [
        {
          text: 'OK',
          handler: (input) => {
            if (!input.name || !input.name.trim()) {
              return false;
            }
            this.userService.signInWithName(input.name);
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

  async setDone(boardId: string, done: boolean) {
    const user = await this.userService.currentUser();
    if (!!user) {
      this.boardService.addOrSetParticipant(boardId, { user, done });
    }
  }
}
