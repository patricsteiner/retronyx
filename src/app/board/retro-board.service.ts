import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RetroBoard, RetroCard, RetroCardItem } from './model';
import { first, map, shareReplay, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

const BOARDS_COLLECTION_NAME = 'boards';

@Injectable({
  providedIn: 'root',
})
export class RetroBoardService {
  private readonly boardsCollection = this.firestore.collection<RetroBoard>(BOARDS_COLLECTION_NAME);

  constructor(private firestore: AngularFirestore, private functions: AngularFireFunctions) {}

  public retroBoards$: Observable<RetroBoard[]> = this.firestore
    .collection<RetroBoard>(BOARDS_COLLECTION_NAME, (ref) => ref.orderBy('createdAt', 'desc'))
    .valueChanges({ idField: 'id' })
    .pipe(
      tap(() => console.log('READ FROM DB')),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  // NOTE: To be able to always trust an index, we can never delete array entries! Only mark them as deleted.
  addItem(boardId: string, cardIdx: number, item: RetroCardItem) {
    const addItemFunction = this.functions.httpsCallable('addItem');
    addItemFunction({ boardId, cardIdx, item });
  }

  deleteItem(boardId: string, cardIdx: number, itemIdx: number) {
    const deleteItemFunction = this.functions.httpsCallable('deleteItem');
    deleteItemFunction({ boardId, cardIdx, itemIdx });
  }

  likeItem(boardId: string, cardIdx: number, itemIdx: number, username: string) {
    const likeItemFunction = this.functions.httpsCallable('likeItem');
    likeItemFunction({ boardId, cardIdx, itemIdx, username });
  }

  unlikeItem(boardId: string, cardIdx: number, itemIdx: number, username: string) {
    const unlikeItemFunction = this.functions.httpsCallable('unlikeItem');
    unlikeItemFunction({ boardId, cardIdx, itemIdx, username });
  }

  flagItem(boardId: string, cardIdx: number, itemIdx: number) {
    const flagItemFunction = this.functions.httpsCallable('flagItem');
    flagItemFunction({ boardId, cardIdx, itemIdx });
  }

  unflagItem(boardId: string, cardIdx: number, itemIdx: number) {
    const unflagItemFunction = this.functions.httpsCallable('unflagItem');
    unflagItemFunction({ boardId, cardIdx, itemIdx });
  }

  async createNewBoard(title: string) {
    title = title.substring(0, 50);
    const board = new RetroBoard(title);
    const allBoards = await this.retroBoards$.pipe(first()).toPromise();
    if (allBoards.map((b) => b.title).includes(title)) {
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
