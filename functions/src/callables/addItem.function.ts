import * as functions from 'firebase-functions';
import { adminSdk, REGION } from '../init';

const db = adminSdk.firestore();

export const addItemFunction = functions.region(REGION).https.onCall(async (data: CreateItemData, context) => {
  const boardRef = db.collection('boards').doc(data.boardId);

  return db.runTransaction((transaction) => {
    return transaction.get(boardRef).then(async (boardDoc) => {
      const board = boardDoc.data();
      // @ts-ignore
      board.cards[data.cardIdx].items.push(data.item);

      transaction.set(boardRef, board);

      console.log(`Created new item in board ${data.boardId} from user ${data.item.user}`);
      return boardRef.id;
    });
  });
});

interface CreateItemData {
  boardId: string;
  cardIdx: number;
  item: any;
}
