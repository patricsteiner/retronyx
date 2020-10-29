import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { NewBoardModalComponent } from './new-board-modal/new-board-modal.component';
import { AboutModalComponent } from './about-modal/about-modal.component';

@NgModule({
  declarations: [NewBoardModalComponent, HeaderComponent, AboutModalComponent],
  imports: [CommonModule, RouterModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [CommonModule, RouterModule, IonicModule, FormsModule, ReactiveFormsModule, HeaderComponent],
})
export class SharedModule {}

// Lazy module to be used by lazy feature modules (i.e. pages).
// Should not have providers, only declarables (components, directives, pipes)!
