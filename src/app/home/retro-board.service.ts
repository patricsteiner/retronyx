import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RetroBoard, RetroCard } from './model';
import { first, map, shareReplay, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RetroBoardService {
  private readonly boardsCollection = this.firestore.collection<RetroBoard>('boards');

  constructor(private firestore: AngularFirestore) {}

  public retroBoards$: Observable<RetroBoard[]> = this.firestore
    .collection<RetroBoard>('boards')
    .valueChanges({ idField: 'id' })
    .pipe(
      tap(() => console.log('READ FROM DB')),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  async updateCard(boardId: string, cardIndex: number, newCard: RetroCard) {
    const newBoard = await this.retroBoards$
      .pipe(
        first(),
        map((boards) => boards.find((board) => board.id === boardId))
      )
      .toPromise();
    newBoard.cards[cardIndex] = newCard;
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
