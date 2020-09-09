import * as functions from 'firebase-functions';
import { adminSdk, REGION } from '../init';

const db = adminSdk.firestore();

export const updateCardTitleFunction = functions
  .region(REGION)
  .https.onCall(async (data: UpdateCardTitleData, context) => {
    const boardRef = db.collection('boards').doc(data.boardId);

    return db.runTransaction((transaction) => {
      return transaction.get(boardRef).then(async (boardDoc) => {
        const board = boardDoc.data();
        // @ts-ignore
        board.cards[data.cardIdx].title = data.title;
        // @ts-ignore
        board.cards[data.cardIdx].emoji = data.emoji;

        transaction.set(boardRef, board);

        console.log(`Title from card ${data.cardIdx} from board ${data.boardId} was changed to ${data.title}`);
        return boardRef.id;
      });
    });
  });

interface UpdateCardTitleData {
  boardId: string;
  cardIdx: number;
  title: string;
  emoji: string;
}
