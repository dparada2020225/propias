import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtVoucherComponent } from './bt-voucher.component';

xdescribe('BulkTransferVoucherComponent', () => {
  let component: BtVoucherComponent;
  let fixture: ComponentFixture<BtVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
