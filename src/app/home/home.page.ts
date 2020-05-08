import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RetroBoard, RetroCard, RetroCardItem } from './model';
import { RetroBoardService } from './retro-board.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  retroBoard$: Observable<RetroBoard> = this.retroBoardService.retroBoard$;

  constructor(private retroBoardService: RetroBoardService) {}

  updateCard(card: RetroCard) {
    this.retroBoardService.updateCard(card);
  }
}
