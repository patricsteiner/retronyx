import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetroCardComponent } from './retro-card.component';

describe('RetroCardComponent', () => {
  let component: RetroCardComponent;
  let fixture: ComponentFixture<RetroCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetroCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RetroCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
