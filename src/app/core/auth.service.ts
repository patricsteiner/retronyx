import { Injectable } from '@angular/core';
import { User } from '../board/model';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, switchMap, take } from 'rxjs/operators';
import { merge, Subject } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // When something in the afAuthUser changes (e.g. displayName), afAuth.authState will not emit this new value,
  // it will only emit on login/logout. Therefore we can use this subject to manually refresh the afAuthUser.
  refreshAfAuthUser = new Subject<void>();

  user$ = merge(
    this.refreshAfAuthUser.pipe(
      switchMap(async () => {
        if (this.afAuth.auth.currentUser) {
          await this.afAuth.auth.currentUser.reload();
        }
        return this.afAuth.auth.currentUser;
      })
    ),
    this.afAuth.authState
  ).pipe(map(this.afAuthUserToUser));

  constructor(private afAuth: AngularFireAuth, private alertController: AlertController) {}

  currentUser(): Promise<User | null> {
    return this.user$.pipe(take(1)).toPromise();
  }

  async isSignedIn() {
    const user = await this.currentUser();
    return !!user?.name;
  }

  async signInWithName(username: string) {
    username = username.trim().substring(0, 20);
    if (!this.afAuth.auth.currentUser) {
      await this.afAuth.auth.signInAnonymously();
    }
    await this.afAuth.auth.currentUser.updateProfile({ displayName: username });
    this.refreshAfAuthUser.next();
  }

  private afAuthUserToUser(afAuthUser: firebase.User): User | null {
    if (afAuthUser) {
      return { id: afAuthUser.uid, name: afAuthUser.displayName };
    } else return null;
  }

  async showLoginPopup() {
    const user = await this.currentUser();
    const alertDialog = await this.alertController.create({
      header: "What's your name?",
      subHeader: '',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: user?.name,
          placeholder: 'Please enter your name...',
        },
      ],
      buttons: [
        {
          text: 'OK',
          handler: (input) => {
            if (!input.name || !input.name.trim()) {
              return false;
            }
            this.signInWithName(input.name);
          },
        },
      ],
    });
    await alertDialog.present();
  }
}
