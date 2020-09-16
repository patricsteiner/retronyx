import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoardPage } from './board-page.component';

import { BoardPageRoutingModule } from './board-routing.module';
import { RetroCardComponent } from './retro-card/retro-card.component';
import { ColorHashPipe } from './color-hash.pipe';
import { NewBoardModalComponent } from './new-board-modal/new-board-modal.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, BoardPageRoutingModule],
  declarations: [BoardPage, RetroCardComponent, NewBoardModalComponent, ColorHashPipe],
  exports: [ColorHashPipe],
})
export class BoardPageModule {}
