import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAchUpdateConfirmationComponent } from './am-ach-update-confirmation.component';

describe('AmAchUpdateConfirmationComponent', () => {
  let component: AmAchUpdateConfirmationComponent;
  let fixture: ComponentFixture<AmAchUpdateConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAchUpdateConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmAchUpdateConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
