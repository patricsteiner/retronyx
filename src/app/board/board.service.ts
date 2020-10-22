import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { RetroBoard, RetroBoardEntry } from './model';
import { filter, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { UserService } from '../user.service';
import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;
import Timestamp = firebase.firestore.Timestamp;

const BOARDS_COLLECTION_NAME = 'boards';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  readonly boardIdSubject = new ReplaySubject<string>(1);
  private readonly boardsCollection = this.firestore.collection<RetroBoard>(BOARDS_COLLECTION_NAME);

  private readonly localBoardState = new BehaviorSubject<RetroBoard>(null);
  private readonly remoteBoardChanges$ = this.boardIdSubject.pipe(
    switchMap((id) =>
      this.boardsCollection
        .doc<RetroBoard>(id)
        .valueChanges()
        .pipe(
          filter((value) => !!value),
          tap((it) => (it.id = id)),
          tap(() => console.debug('READ 1 BOARD FROM DB'))
        )
    )
  );

  private readonly localEntriesState = new BehaviorSubject<RetroBoardEntry[]>([]);
  private readonly remoteEntriesChanges$ = this.boardIdSubject.pipe(
    switchMap((id) =>
      this.boardsCollection
        .doc<RetroBoard>(id)
        .collection<RetroBoardEntry>('entries')
        .valueChanges({ idField: 'id' })
        .pipe(
          filter((value) => !!value),
          tap((entries) => console.debug(`READ ${entries.length} ENTRIES FROM DB`))
        )
    )
  );

  readonly board$ = this.localBoardState.asObservable();

  readonly entries$ = this.localEntriesState.asObservable();

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly functions: AngularFireFunctions,
    private readonly userService: UserService
  ) {
    this.remoteBoardChanges$.subscribe(this.localBoardState);
    this.remoteEntriesChanges$.subscribe(this.localEntriesState);
  }

  addEntry(boardId: string, entry: RetroBoardEntry) {
    const existingSameEntry = this.localEntriesState.value.find(
      (e) => e.text === entry.text && e.cardIdx === entry.cardIdx
    );
    if (existingSameEntry) {
      this.likeEntry(boardId, existingSameEntry.id, entry.user);
      return;
    }
    const newEntries = [...this.localEntriesState.value];
    newEntries.push(entry);
    this.localEntriesState.next(newEntries); // optimistic update, so app feels more responsive
    this.boardsCollection.doc<RetroBoard>(boardId).collection<RetroBoardEntry>('entries').add(entry);
  }

  deleteEntry(boardId: string, entryId: string) {
    const newEntries = [...this.localEntriesState.value];
    const idx = newEntries.findIndex((e) => e.id == entryId);
    if (idx !== -1) {
      newEntries.splice(idx, 1);
    }
    this.localEntriesState.next(newEntries); // optimistic update, so app feels more responsive
    this.boardsCollection
      .doc<RetroBoard>(boardId)
      .collection('entries')
      .doc<RetroBoardEntry>(entryId)
      .update({ deleted: true });
  }

  likeEntry(boardId: string, entryId: string, username: string) {
    const newEntries = [...this.localEntriesState.value];
    newEntries[newEntries.findIndex((e) => e.id == entryId)].likes.push(username);
    this.localEntriesState.next(newEntries); // optimistic update, so app feels more responsive
    this.boardsCollection
      .doc<RetroBoard>(boardId)
      .collection('entries')
      .doc<RetroBoardEntry>(entryId)
      .update({ likes: (FieldValue.arrayUnion(username) as unknown) as string[] });
  }

  unlikeEntry(boardId: string, entryId: string, username: string) {
    const newEntries = [...this.localEntriesState.value];
    const entry = newEntries[newEntries.findIndex((e) => e.id == entryId)];
    const idx = entry.likes.findIndex((name) => name === username);
    if (idx !== -1) {
      entry.likes.splice(idx, 1);
    }
    this.localEntriesState.next(newEntries); // optimistic update, so app feels more responsive
    this.boardsCollection
      .doc<RetroBoard>(boardId)
      .collection('entries')
      .doc<RetroBoardEntry>(entryId)
      .update({ likes: (FieldValue.arrayRemove(username) as unknown) as string[] });
  }

  flagEntry(boardId: string, entryId: string) {
    this.boardsCollection
      .doc<RetroBoard>(boardId)
      .collection('entries')
      .doc<RetroBoardEntry>(entryId)
      .update({ flag: true });
  }

  unflagEntry(boardId: string, entryId: string) {
    this.boardsCollection
      .doc<RetroBoard>(boardId)
      .collection('entries')
      .doc<RetroBoardEntry>(entryId)
      .update({ flag: false });
  }

  updateCardTitle(boardId: string, cardIdx: number, title: string, emoji: string) {
    title = title.substring(0, 50);
    emoji = emoji.substring(0, 4);
    const newBoard = { ...this.localBoardState.value };
    newBoard.cards[cardIdx].title = title;
    newBoard.cards[cardIdx].emoji = emoji;
    this.localBoardState.next(newBoard); // optimistic update, so app feels more responsive
    this.boardsCollection.doc<RetroBoard>(boardId).update(newBoard);
  }

  async createNewBoard(title: string, template: string) {
    title = title.substring(0, 100);
    const user = await this.userService.currentUser();
    const board = new RetroBoard(title, user, template);
    return this.boardsCollection.add({ ...board, createdAt: FieldValue.serverTimestamp() as Timestamp });
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
