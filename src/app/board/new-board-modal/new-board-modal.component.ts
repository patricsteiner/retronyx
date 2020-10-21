import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { BoardService } from '../board.service';
import { CustomValidators } from '../../custom-validators';

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
    private navCtrl: NavController
  ) {}

  submit() {
    if (!this.form.valid) {
      this.error = 'Please enter a title between 3 and 100 characters';
      return;
    }
    this.retroBoardService.createNewBoard(this.form.value.title, this.form.value.template).then(
      (ref) => this.navigateToBoard(ref.id),
      () => {
        this.error = 'Sorry, could not create the board... Some error happened :(';
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
