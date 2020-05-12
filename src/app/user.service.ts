import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  username$ = new BehaviorSubject<string>('');
  constructor() {}

  login(username: string) {
    this.username$.next(username);
  }
}
