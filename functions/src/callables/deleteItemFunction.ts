import * as functions from 'firebase-functions';
import { adminSdk, REGION } from '../init';

const db = adminSdk.firestore();

export const deleteItemFunction = functions.region(REGION).https.onCall(async (data: DeleteItemData, context) => {
  const boardRef = db.collection('boards').doc(data.boardId);

  return db.runTransaction((transaction) => {
    return transaction.get(boardRef).then(async (boardDoc) => {
      const board = boardDoc.data();
      // @ts-ignore
      board.cards[data.cardIdx].items[data.itemIdx].deleted = true;

      transaction.set(boardRef, board);

      console.log(`Deleted item ${data.itemIdx} in card ${data.cardIdx} from board ${data.boardId}`);
      return boardRef.id;
    });
  });
});

interface DeleteItemData {
  boardId: string;
  cardIdx: number;
  itemIdx: number;
}
