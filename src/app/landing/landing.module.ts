import { NgModule } from '@angular/core';

import { LandingPageRoutingModule } from './landing-routing.module';

import { LandingPage } from './landing.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule, LandingPageRoutingModule],
  declarations: [LandingPage],
})
export class LandingPageModule {}
