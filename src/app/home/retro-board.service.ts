import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RetroBoard, RetroCard, RetroCardItem } from './model';
import { shareReplay, startWith, tap } from 'rxjs/operators';

const EMPTY_RETRO_BOARD = {
  title: 'Onyx Retroboard',
  cards: [
    { title: 'happy', items: [] },
    { title: 'sad', items: [] },
    { title: 'idea', items: [] },
    { title: 'flower', items: [] },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class RetroBoardService {
  private currentBoard: RetroBoard;

  retroBoardSubject = new Subject();

  public retroBoard$: Observable<RetroBoard> = this.retroBoardSubject.pipe(
    startWith<RetroBoard>(EMPTY_RETRO_BOARD),
    tap((board) => (this.currentBoard = board)),
    shareReplay(1)
  );

  updateCard(newCard: RetroCard) {
    const newBoard = { ...this.currentBoard };
    for (let card of newBoard.cards) {
      if (card.title === newCard.title) {
        card.items = [...newCard.items];
      }
    }
    this.retroBoardSubject.next(newBoard);
  }
}
