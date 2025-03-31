import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T365VoucherComponent } from './t365-voucher.component';

describe('T365VoucherComponent', () => {
  let component: T365VoucherComponent;
  let fixture: ComponentFixture<T365VoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ T365VoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T365VoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
