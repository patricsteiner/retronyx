import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewBoardModalComponent } from '../shared/new-board-modal/new-board-modal.component';
import { AboutModalComponent } from '../shared/about-modal/about-modal.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

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
