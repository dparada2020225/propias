import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationVoucherComponent } from './donation-voucher.component';

xdescribe('DonationVoucherComponent', () => {
  let component: DonationVoucherComponent;
  let fixture: ComponentFixture<DonationVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
