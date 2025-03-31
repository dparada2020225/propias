import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmM365VoucherComponent } from './am-m365-voucher.component';

describe('AmM365VoucherComponent', () => {
  let component: AmM365VoucherComponent;
  let fixture: ComponentFixture<AmM365VoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmM365VoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmM365VoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
