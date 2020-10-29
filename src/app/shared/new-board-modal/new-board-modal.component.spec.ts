import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewBoardModalComponent } from './new-board-modal.component';

describe('NewBoardModalComponent', () => {
  let component: NewBoardModalComponent;
  let fixture: ComponentFixture<NewBoardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewBoardModalComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NewBoardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
