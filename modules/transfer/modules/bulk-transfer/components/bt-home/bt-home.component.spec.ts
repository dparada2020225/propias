import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtHomeComponent } from './bt-home.component';

xdescribe('BulkTransferComponent', () => {
  let component: BtHomeComponent;
  let fixture: ComponentFixture<BtHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
