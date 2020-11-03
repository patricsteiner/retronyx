import { Component, Input } from '@angular/core';
import { BoardService } from '../board.service';
import { PopoverController } from '@ionic/angular';

@Component({
  templateUrl: './admin-actions-popover.component.html',
  styleUrls: ['./admin-actions-popover.component.scss'],
})
export class AdminActionsPopoverComponent {
  @Input()
  private boardId: string;

  constructor(private popoverController: PopoverController, private boardService: BoardService) {}

  async deleteBoard() {
    if (confirm('Do you really want to delete this board?')) {
      await this.boardService.deleteBoard(this.boardId);
      this.popoverController.dismiss();
    }
  }

  async wipeBoard() {
    if (confirm('Do you really want to wipe all entries on this board?')) {
      await this.boardService.wipeBoard(this.boardId);
      this.popoverController.dismiss();
    }
  }
}
