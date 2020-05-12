import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usernameSubject = new BehaviorSubject<string>(null);

  username$ = this.usernameSubject.asObservable();

  currentUser(): string {
    return this.usernameSubject.getValue();
  }

  constructor(private storage: Storage) {
    this.storage.get('username').then((username) => {
      if (username) {
        this.usernameSubject.next(username);
      }
    });
  }

  login(username: string) {
    this.usernameSubject.next(username);
    return this.storage.set('username', username);
  }
}
