import { Component, Input } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ModalController } from '@ionic/angular';
import { NewBoardModalComponent } from '../new-board-modal/new-board-modal.component';
import { AboutModalComponent } from '../about-modal/about-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input()
  title: string = '';

  constructor(public authService: AuthService, private modalController: ModalController) {}

  async showNewBoardModal() {
    const modal = await this.modalController.create({
      component: NewBoardModalComponent,
      cssClass: 'new-board-modal',
    });
    await modal.present();
  }

  async showAboutModal() {
    const modal = await this.modalController.create({
      component: AboutModalComponent,
      cssClass: 'about-modal',
    });
    await modal.present();
  }
}
