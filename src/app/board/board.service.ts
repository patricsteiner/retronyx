import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RetroBoard, RetroCardItem } from './model';
import { filter, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { UserService } from '../user.service';

const BOARDS_COLLECTION_NAME = 'boards';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly boardsCollection = this.firestore.collection<RetroBoard>(BOARDS_COLLECTION_NAME);

  constructor(
    private firestore: AngularFirestore,
    private functions: AngularFireFunctions,
    private userService: UserService
  ) {}

  getBoard$(id: string): Observable<RetroBoard> {
    return this.boardsCollection
      .doc<RetroBoard>(id)
      .valueChanges()
      .pipe(
        filter((value) => !!value),
        tap((it) => (it.id = id)),
        tap(() => console.log('READ 1 FROM DB'))
      );
  }

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

  updateCardTitle(boardId: string, cardIdx: number, title: string, emoji: string) {
    title = title.substring(0, 50);
    emoji = emoji.substring(0, 4);
    const updateCardTitleFunction = this.functions.httpsCallable('updateCardTitle');
    updateCardTitleFunction({ boardId, cardIdx, title, emoji });
  }

  async createNewBoard(title: string) {
    title = title.substring(0, 100);
    const user = await this.userService.currentUser();
    const board = new RetroBoard(title, user);
    return this.boardsCollection.add({ ...board });
  }

  // async deleteBoard(id: string) {
  //   return this.boardsCollection.doc(id).delete();
  // }
  //
  // async deleteAll() {
  //   const allBoardsQuerySnapshot = await this.boardsCollection.ref.get();
  //   allBoardsQuerySnapshot.forEach((doc) => {
  //     doc.ref.delete();
  //   });
  // }
}
