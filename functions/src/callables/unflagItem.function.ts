import * as functions from 'firebase-functions';
import { adminSdk, REGION } from '../init';

const db = adminSdk.firestore();

export const unflagItemFunction = functions.region(REGION).https.onCall(async (data: UnflagItemData, context) => {
  const boardRef = db.collection('boards').doc(data.boardId);

  return db.runTransaction((transaction) => {
    return transaction.get(boardRef).then(async (boardDoc) => {
      const board = boardDoc.data();
      // @ts-ignore
      board.cards[data.cardIdx].items[data.itemIdx].flag = false;

      transaction.set(boardRef, board);

      console.log(`Unflagged item ${data.itemIdx} in card ${data.cardIdx} from board ${data.boardId}`);
      return boardRef.id;
    });
  });
});

interface UnflagItemData {
  boardId: string;
  cardIdx: number;
  itemIdx: number;
}
