import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAchVoucherComponent } from './am-ach-voucher.component';

describe('AmAchVoucherComponent', () => {
  let component: AmAchVoucherComponent;
  let fixture: ComponentFixture<AmAchVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAchVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmAchVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
