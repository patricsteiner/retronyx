import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { RetroCardComponent } from './retro-card/retro-card.component';
import { StringToColorPipe } from './string-to-color.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage, RetroCardComponent, StringToColorPipe],
  exports: [StringToColorPipe],
})
export class HomePageModule {}
