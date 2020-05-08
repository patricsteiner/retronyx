import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RetroBoard, RetroCardItem } from './model';
import { shareReplay, startWith, tap } from 'rxjs/operators';

const EMPTY_RETRO_BOARD = {
  happyCard: { items: [{ text: 'asda', likes: 123 }] },
  sadCard: { items: [{ text: 'asd' }] },
  ideaCard: { items: [{ text: 'asd' }] },
  flowerCard: { items: [{ text: 'asd' }] },
};

@Injectable({
  providedIn: 'root',
})
export class RetroBoardService {
  private currentBoard: RetroBoard;

  retroBoardSubject = new Subject();

  public retroBoard$: Observable<RetroBoard> = this.retroBoardSubject.pipe(
    startWith<RetroBoard>(EMPTY_RETRO_BOARD),
    tap((board) => (this.currentBoard = board)),
    shareReplay(1)
  );

  addHappyItem(item: RetroCardItem) {
    const newBoard = { ...this.currentBoard, happyCard: { items: [...this.currentBoard.happyCard.items, item] } };
    this.retroBoardSubject.next(newBoard);
  }

  addSadItem(item: RetroCardItem) {
    const newBoard = { ...this.currentBoard, sadCard: { items: [...this.currentBoard.sadCard.items, item] } };
    this.retroBoardSubject.next(newBoard);
  }

  addIdeaItem(item: RetroCardItem) {
    const newBoard = { ...this.currentBoard, ideaCard: { items: [...this.currentBoard.ideaCard.items, item] } };
    this.retroBoardSubject.next(newBoard);
  }

  addFlowerItem(item: RetroCardItem) {
    const newBoard = { ...this.currentBoard, flowerCard: { items: [...this.currentBoard.flowerCard.items, item] } };
    this.retroBoardSubject.next(newBoard);
  }

  likeHappyItem(index: number) {
    const newItems = [...this.currentBoard.happyCard.items];
    if (newItems[index].likes) {
      newItems[index].likes++;
    } else {
      newItems[index].likes = 1;
    }
    const newBoard = { ...this.currentBoard, happyCard: { items: newItems } };
    this.retroBoardSubject.next(newBoard);
  }

  likeSadItem(index: number) {
    const newItems = [...this.currentBoard.sadCard.items];
    if (newItems[index].likes) {
      newItems[index].likes++;
    } else {
      newItems[index].likes = 1;
    }
    const newBoard = { ...this.currentBoard, sadCard: { items: newItems } };
    this.retroBoardSubject.next(newBoard);
  }

  likeIdeaItem(index: number) {
    const newItems = [...this.currentBoard.ideaCard.items];
    if (newItems[index].likes) {
      newItems[index].likes++;
    } else {
      newItems[index].likes = 1;
    }
    const newBoard = { ...this.currentBoard, ideaCard: { items: newItems } };
    this.retroBoardSubject.next(newBoard);
  }

  likeFlowerItem(index: number) {
    const newItems = [...this.currentBoard.flowerCard.items];
    if (newItems[index].likes) {
      newItems[index].likes++;
    } else {
      newItems[index].likes = 1;
    }
    const newBoard = { ...this.currentBoard, flowerCard: { items: newItems } };
    this.retroBoardSubject.next(newBoard);
  }
}
