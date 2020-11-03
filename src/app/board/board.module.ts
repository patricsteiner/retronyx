import { NgModule } from '@angular/core';
import { BoardPage } from './board-page.component';

import { BoardPageRoutingModule } from './board-routing.module';
import { RetroCardComponent } from './retro-card/retro-card.component';
import { ColorHashPipe } from './color-hash.pipe';
import { SharedModule } from '../shared/shared.module';
import { AdminActionsPopoverComponent } from './admin-actions-popover/admin-actions-popover.component';

@NgModule({
  imports: [SharedModule, BoardPageRoutingModule],
  declarations: [BoardPage, RetroCardComponent, ColorHashPipe, AdminActionsPopoverComponent],
  exports: [ColorHashPipe],
})
export class BoardPageModule {}
