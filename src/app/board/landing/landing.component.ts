import { Component, OnInit } from '@angular/core';
import { NewBoardModalComponent } from '../new-board-modal/new-board-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async showNewBoardModal() {
    const modal = await this.modalController.create({
      component: NewBoardModalComponent,
      cssClass: 'new-board-modal',
    });
    await modal.present();
  }
}
