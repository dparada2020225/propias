import { ComponentFixture, TestBed } from '@angular/core/testing';

import { M365VoucherComponent } from './m365-voucher.component';

describe('M365VoucherComponent', () => {
  let component: M365VoucherComponent;
  let fixture: ComponentFixture<M365VoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ M365VoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(M365VoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
