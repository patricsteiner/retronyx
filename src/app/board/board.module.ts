import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { BoardPage } from './board-page.component';

import { BoardPageRoutingModule } from './board-routing.module';
import { RetroCardComponent } from './retro-card/retro-card.component';
import { ColorHashPipe } from './color-hash.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, BoardPageRoutingModule],
  declarations: [BoardPage, RetroCardComponent, ColorHashPipe],
  exports: [ColorHashPipe],
})
export class BoardPageModule {}
