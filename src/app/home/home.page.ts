import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RetroBoard, RetroCardItem } from './model';
import { RetroBoardService } from './retro-board.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  retroBoard$: Observable<RetroBoard> = this.retroBoardService.retroBoard$;

  constructor(private retroBoardService: RetroBoardService) {}

  addHappyItem(item: RetroCardItem) {
    this.retroBoardService.addHappyItem(item);
  }

  addSadItem(item: RetroCardItem) {
    this.retroBoardService.addSadItem(item);
  }

  addIdeaItem(item: RetroCardItem) {
    this.retroBoardService.addIdeaItem(item);
  }

  addFlowerItem(item: RetroCardItem) {
    this.retroBoardService.addFlowerItem(item);
  }

  likeHappyItem(index: number) {
    this.retroBoardService.likeHappyItem(index);
  }

  likeSadItem(index: number) {
    this.retroBoardService.likeSadItem(index);
  }

  likeIdeaItem(index: number) {
    this.retroBoardService.likeIdeaItem(index);
  }

  likeFlowerItem(index: number) {
    this.retroBoardService.likeFlowerItem(index);
  }
}
