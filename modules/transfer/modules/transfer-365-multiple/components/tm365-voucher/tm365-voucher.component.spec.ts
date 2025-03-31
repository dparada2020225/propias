import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tm365VoucherComponent } from './tm365-voucher.component';

describe('Tm365VoucherComponent', () => {
  let component: Tm365VoucherComponent;
  let fixture: ComponentFixture<Tm365VoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tm365VoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tm365VoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
