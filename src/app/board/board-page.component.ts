import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { Participant, RetroBoard, RetroBoardEntry, User } from './model';
import { BoardService } from './board.service';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';

@Component({
  templateUrl: 'board-page.component.html',
  styleUrls: ['board-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardPage implements OnInit, OnDestroy {
  board$: Observable<RetroBoard> = this.boardService.board$;
  entries$: Observable<RetroBoardEntry[]> = this.boardService.entries$;
  participants$: Observable<Participant[]> = this.boardService.participants$;
  user$: Observable<User> = this.authService.user$;
  isDone$: Observable<boolean> = combineLatest([this.participants$, this.user$]).pipe(
    filter(([participants, user]) => !!participants && !!user),
    map(([participants, user]) => {
      const participant = participants.find((p) => p.user.id === user.id);
      return participant?.done;
    })
  );

  private destroy$ = new Subject();

  constructor(
    private boardService: BoardService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private authService: AuthService
  ) {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        filter((id) => !!id),
        tap(async () => {
          if (!(await this.authService.isSignedIn())) {
            await this.authService.showLoginPopup();
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

  async setDone(boardId: string, done: boolean) {
    const user = await this.authService.currentUser();
    if (!!user) {
      this.boardService.addOrSetParticipant(boardId, { user, done });
    } else {
      await this.authService.showLoginPopup();
    }
  }

  async deleteBoard(boardId: string) {
    if (confirm('Do you really want to delete this board?')) {
      await this.boardService.deleteBoard(boardId);
    }
  }
}
