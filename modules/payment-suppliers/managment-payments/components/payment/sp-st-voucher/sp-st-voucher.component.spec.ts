import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpStVoucherComponent } from './sp-st-voucher.component';

describe('SpStVoucherComponent', () => {
  let component: SpStVoucherComponent;
  let fixture: ComponentFixture<SpStVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpStVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpStVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
