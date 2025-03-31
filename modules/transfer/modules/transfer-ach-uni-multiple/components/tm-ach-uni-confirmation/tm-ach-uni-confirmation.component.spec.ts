import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAchUniConfirmationComponent } from './tm-ach-uni-confirmation.component';

describe('TmAchUniConfirmationComponent', () => {
  let component: TmAchUniConfirmationComponent;
  let fixture: ComponentFixture<TmAchUniConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmAchUniConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmAchUniConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
