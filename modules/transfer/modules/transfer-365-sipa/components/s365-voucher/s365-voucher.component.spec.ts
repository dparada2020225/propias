import { ComponentFixture, TestBed } from '@angular/core/testing';

import { S365VoucherComponent } from './s365-voucher.component';

describe('S365VoucherComponent', () => {
  let component: S365VoucherComponent;
  let fixture: ComponentFixture<S365VoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ S365VoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(S365VoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
