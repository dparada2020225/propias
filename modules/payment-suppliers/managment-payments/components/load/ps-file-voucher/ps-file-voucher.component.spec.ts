import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsFileVoucherComponent } from './ps-file-voucher.component';

describe('PsFileVoucherComponent', () => {
  let component: PsFileVoucherComponent;
  let fixture: ComponentFixture<PsFileVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsFileVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsFileVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
