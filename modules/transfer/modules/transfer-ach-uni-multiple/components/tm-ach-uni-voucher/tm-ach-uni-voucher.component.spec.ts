import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAchUniVoucherComponent } from './tm-ach-uni-voucher.component';

describe('TmAchUniVoucherComponent', () => {
  let component: TmAchUniVoucherComponent;
  let fixture: ComponentFixture<TmAchUniVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmAchUniVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmAchUniVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
