import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RetroBoard, RetroCard, RetroCardItem } from './model';
import { shareReplay, startWith, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RetroBoardService {
  private currentBoard: RetroBoard;

  constructor(private firestore: AngularFirestore) {}

  public retroBoard$: Observable<RetroBoard> = this.firestore
    .doc<RetroBoard>('boards/onyx')
    .valueChanges()
    .pipe(
      tap((board) => (this.currentBoard = board)),
      shareReplay(1)
    );

  updateCard(newCard: RetroCard) {
    const newBoard = { ...this.currentBoard };
    for (const card of newBoard.cards) {
      if (card.title === newCard.title) {
        card.items = [...newCard.items];
      }
    }
    this.firestore.doc<RetroBoard>('boards/onyx').update(newBoard);
  }

  // create
}
