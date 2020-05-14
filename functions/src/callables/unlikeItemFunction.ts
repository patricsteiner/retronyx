import * as functions from 'firebase-functions';
import { adminSdk, REGION } from '../init';

const db = adminSdk.firestore();

export const unlikeItemFunction = functions.region(REGION).https.onCall(async (data: UnlikeItemData, context) => {
  const boardRef = db.collection('boards').doc(data.boardId);

  return db.runTransaction((transaction) => {
    return transaction.get(boardRef).then(async (boardDoc) => {
      const board = boardDoc.data();
      // @ts-ignore
      const likes = board.cards[data.cardIdx].items[data.itemIdx].likes;

      const index = likes.indexOf(data.username);
      if (index > -1) {
        likes.splice(index, 1);
      }

      transaction.set(boardRef, board);

      console.log(
        `User ${data.username} unliked item ${data.itemIdx} in card ${data.cardIdx} from board ${data.boardId}`
      );
      return boardRef.id;
    });
  });
});

interface UnlikeItemData {
  boardId: string;
  cardIdx: number;
  itemIdx: number;
  username: string;
}
