import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsManualVoucherComponent } from './ps-manual-voucher.component';

describe('PsManualVoucherComponent', () => {
  let component: PsManualVoucherComponent;
  let fixture: ComponentFixture<PsManualVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsManualVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsManualVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
