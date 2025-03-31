import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmT365mVoucherComponent } from './am-t365m-voucher.component';

describe('AmM365VoucherComponent', () => {
  let component: AmT365mVoucherComponent;
  let fixture: ComponentFixture<AmT365mVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmT365mVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmT365mVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
