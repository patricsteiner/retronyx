import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RetroBoard, RetroCard } from './model';
import { first, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RetroBoardService {
  private readonly boardsCollection = this.firestore.collection<RetroBoard>('boards');

  private selectedBoardIdSubject = new Subject<string>();

  private currentBoard: RetroBoard;

  constructor(private firestore: AngularFirestore) {}

  public retroBoards$: Observable<RetroBoard[]> = this.firestore
    .collection<RetroBoard>('boards')
    .valueChanges({ idField: 'id' })
    .pipe(
      tap(() => console.log('READ FROM DB')),
      shareReplay(1)
    );

  public selectedBoard$: Observable<RetroBoard> = this.selectedBoardIdSubject.pipe(
    switchMap((id) => this.retroBoards$.pipe(map((boards) => boards.find((board) => board.id === id)))),
    tap((board) => (this.currentBoard = board))
  );

  selectBoard(id: string) {
    this.selectedBoardIdSubject.next(id);
  }

  async updateCard(newCard: RetroCard) {
    const newBoard = { ...this.currentBoard };
    for (const card of newBoard.cards) {
      if (card.emoji === newCard.emoji) {
        card.items = [...newCard.items];
      }
    }
    this.boardsCollection.doc(newBoard.id).update(newBoard);
  }

  async createNewBoard(title: string) {
    const board = new RetroBoard(title);
    const allBoards = await this.retroBoards$.pipe(first()).toPromise();
    if (allBoards.map((board) => board.title).includes(title)) {
      return Promise.reject();
    }
    return this.boardsCollection.add({ ...board });
  }

  async deleteBoard(id: string) {
    return this.boardsCollection.doc(id).delete();
  }

  async deleteAll() {
    const allBoardsQuerySnapshot = await this.boardsCollection.ref.get();
    allBoardsQuerySnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  }
}
