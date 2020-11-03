import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  constructor() {}

  public highlightedUserId$ = new BehaviorSubject<string>(null);

  highLight(userId: string) {
    if (this.highlightedUserId$.value === userId) {
      this.highlightedUserId$.next(null);
    } else {
      this.highlightedUserId$.next(userId);
    }
  }
}
