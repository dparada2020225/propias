import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmS365VoucherComponent } from './am-s365-voucher.component';

describe('AmS365VoucherComponent', () => {
  let component: AmS365VoucherComponent;
  let fixture: ComponentFixture<AmS365VoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmS365VoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmS365VoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
