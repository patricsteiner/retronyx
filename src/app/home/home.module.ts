import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { RetroCardComponent } from './retro-card/retro-card.component';
import { ColorHashPipe } from './color-hash.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage, RetroCardComponent, ColorHashPipe],
  exports: [ColorHashPipe],
})
export class HomePageModule {}
