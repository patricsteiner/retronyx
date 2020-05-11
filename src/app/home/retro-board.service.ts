import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RetroBoard, RetroCard } from './model';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
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

  public retroBoard$: Observable<RetroBoard> = this.selectedBoardIdSubject.pipe(
    switchMap((id) => this.retroBoards$.pipe(map((boards) => boards.find((board) => board.id === id)))),
    tap((board) => (this.currentBoard = board))
  );

  selectBoard(id: string) {
    this.selectedBoardIdSubject.next(id);
  }

  async updateCard(newCard: RetroCard) {
    const newBoard = { ...this.currentBoard };
    for (const card of newBoard.cards) {
      if (card.title === newCard.title) {
        card.items = [...newCard.items];
      }
    }
    this.boardsCollection.doc(newBoard.id).update(newBoard);
  }

  async createNewBoard(title: string) {
    const board = new RetroBoard(title);
    return this.boardsCollection.add({ ...board });
  }

  async deleteBoard(id: string) {
    return this.boardsCollection.doc(id).delete();
  }

  async deleteAll() {
    const allBoardsQuery: firebase.firestore.QuerySnapshot = await this.firestore.collection('boards').ref.get();
    allBoardsQuery.forEach((doc) => {
      doc.ref.delete();
    });
  }
}
