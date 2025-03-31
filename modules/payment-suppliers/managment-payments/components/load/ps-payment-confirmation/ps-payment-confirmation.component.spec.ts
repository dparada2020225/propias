import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsPaymentConfirmationComponent } from './ps-payment-confirmation.component';

describe('PsPaymentConfirmationComponent', () => {
  let component: PsPaymentConfirmationComponent;
  let fixture: ComponentFixture<PsPaymentConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsPaymentConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsPaymentConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
