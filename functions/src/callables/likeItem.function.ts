import * as functions from 'firebase-functions';
import { adminSdk, REGION } from '../init';

const db = adminSdk.firestore();

// just here as an example
export const likeItemFunction = functions.region(REGION).https.onCall(async (data: LikeItemData, context) => {
  const boardRef = db.collection('boards').doc(data.boardId);

  return db.runTransaction((transaction) => {
    return transaction.get(boardRef).then(async (boardDoc) => {
      const board = boardDoc.data();
      // @ts-ignore
      const likes = board.cards[data.cardIdx].items[data.itemIdx].likes;
      if (!likes.includes(data.username)) {
        likes.push(data.username);
      }

      transaction.set(boardRef, board);

      console.log(
        `User ${data.username} liked item ${data.itemIdx} in card ${data.cardIdx} from board ${data.boardId}`
      );
      return boardRef.id;
    });
  });
});

interface LikeItemData {
  boardId: string;
  cardIdx: number;
  itemIdx: number;
  username: string;
}
