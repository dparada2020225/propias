import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsPaymentVoucherComponent } from './ps-payment-voucher.component';

describe('PsPaymentVoucherComponent', () => {
  let component: PsPaymentVoucherComponent;
  let fixture: ComponentFixture<PsPaymentVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsPaymentVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsPaymentVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
