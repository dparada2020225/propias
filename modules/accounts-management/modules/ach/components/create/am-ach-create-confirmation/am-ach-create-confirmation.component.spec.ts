import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAchCreateConfirmationComponent } from './am-ach-create-confirmation.component';

describe('AmAchCreateConfirmationComponent', () => {
  let component: AmAchCreateConfirmationComponent;
  let fixture: ComponentFixture<AmAchCreateConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAchCreateConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmAchCreateConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
