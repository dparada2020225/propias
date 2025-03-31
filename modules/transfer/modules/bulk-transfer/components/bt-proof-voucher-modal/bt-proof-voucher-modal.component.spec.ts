import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtProofVoucherModalComponent } from './bt-proof-voucher-modal.component';

xdescribe('BulkTransferTableModalComponent', () => {
  let component: BtProofVoucherModalComponent;
  let fixture: ComponentFixture<BtProofVoucherModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtProofVoucherModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtProofVoucherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
