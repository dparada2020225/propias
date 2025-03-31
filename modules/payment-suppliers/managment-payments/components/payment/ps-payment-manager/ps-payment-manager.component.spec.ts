import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsPaymentManagerComponent } from './ps-payment-manager.component';

describe('PsPaymentManagerComponent', () => {
  let component: PsPaymentManagerComponent;
  let fixture: ComponentFixture<PsPaymentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsPaymentManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsPaymentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
