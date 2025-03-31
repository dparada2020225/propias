import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherUpdateDataComponent } from './voucher-update-data.component';

describe('VoucherUpdateDataComponent', () => {
  let component: VoucherUpdateDataComponent;
  let fixture: ComponentFixture<VoucherUpdateDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherUpdateDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherUpdateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
