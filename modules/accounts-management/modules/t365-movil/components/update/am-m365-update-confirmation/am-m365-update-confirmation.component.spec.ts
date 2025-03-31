import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmM365UpdateConfirmationComponent } from './am-m365-update-confirmation.component';

describe('AmM365UpdateConfirmationComponent', () => {
  let component: AmM365UpdateConfirmationComponent;
  let fixture: ComponentFixture<AmM365UpdateConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmM365UpdateConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmM365UpdateConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
