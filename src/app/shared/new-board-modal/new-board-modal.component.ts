import { Component } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { BoardService } from '../../board/board.service';
import { CustomValidators } from '../../core/custom-validators';

@Component({
  templateUrl: './new-board-modal.component.html',
  styleUrls: ['./new-board-modal.component.scss'],
})
export class NewBoardModalComponent {
  form = this.fb.group({
    title: ['', [Validators.required, CustomValidators.notEmpty, Validators.minLength(3), Validators.maxLength(100)]],
    template: ['EN', [Validators.required]],
  });
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private retroBoardService: BoardService,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  submit() {
    if (!this.form.valid) {
      this.error = 'Please enter a title between 3 and 100 characters';
      return;
    }
    this.retroBoardService.createNewBoard(this.form.value.title, this.form.value.template).then(
      (ref) => this.navigateAndUrlToClipboard(ref.id),
      () => {
        this.error = 'Sorry, could not create the board... Some error happened :(';
      }
    );
    this.modalController.dismiss();
  }

  abort() {
    this.modalController.dismiss();
  }

  async navigateAndUrlToClipboard(id: string) {
    await this.navCtrl.navigateForward('/board/' + id);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = window.location.href;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    const toast = await this.toastController.create({
      message: '📋 Link copied to clipboard',
      duration: 3000,
      cssClass: 'toast',
      color: 'success',
    });
    toast.present();
  }
}
