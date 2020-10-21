import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { RetroBoardService } from '../retro-board.service';

@Component({
  templateUrl: './new-board-modal.component.html',
  styleUrls: ['./new-board-modal.component.scss'],
})
export class NewBoardModalComponent {
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    public: [false],
  });
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private retroBoardService: RetroBoardService,
    private navCtrl: NavController
  ) {}

  submit() {
    if (!this.form.valid) {
      this.error = 'Bitte einen Titel zwischen 3 und 100 Zeichen eingeben';
      return;
    }
    this.retroBoardService.createNewBoard(this.form.value.title, this.form.value.public).then(
      (ref) => this.navigateToBoard(ref.id),
      () => {
        this.error = 'Dieser Titel wird bereits verwendet';
      }
    );
    this.modalController.dismiss();
  }

  abort() {
    this.modalController.dismiss();
  }

  navigateToBoard(id: string) {
    this.navCtrl.navigateForward('/board/' + id);
  }
}
