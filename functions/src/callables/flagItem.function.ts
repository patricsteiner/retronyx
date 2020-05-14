import * as functions from 'firebase-functions';
import { adminSdk, REGION } from '../init';

const db = adminSdk.firestore();

export const flagItemFunction = functions.region(REGION).https.onCall(async (data: FlagItemData, context) => {
  const boardRef = db.collection('boards').doc(data.boardId);

  return db.runTransaction((transaction) => {
    return transaction.get(boardRef).then(async (boardDoc) => {
      const board = boardDoc.data();
      // @ts-ignore
      board.cards[data.cardIdx].items[data.itemIdx].flag = true;

      transaction.set(boardRef, board);

      console.log(`Flagged item ${data.itemIdx} in card ${data.cardIdx} from board ${data.boardId}`);
      return boardRef.id;
    });
  });
});

interface FlagItemData {
  boardId: string;
  cardIdx: number;
  itemIdx: number;
}
