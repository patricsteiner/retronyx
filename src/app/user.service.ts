import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

const USERNAME_KEY = 'username';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usernameSubject = new BehaviorSubject<string>(null);

  username$ = this.usernameSubject.asObservable();

  async currentUser() {
    return await this.storage.get(USERNAME_KEY);
  }

  constructor(private storage: Storage) {
    this.storage.get(USERNAME_KEY).then((username) => {
      if (username) {
        this.usernameSubject.next(username);
      }
    });
  }

  login(username: string) {
    username = username.substring(0, 20);
    this.usernameSubject.next(username);
    return this.storage.set(USERNAME_KEY, username);
  }
}
