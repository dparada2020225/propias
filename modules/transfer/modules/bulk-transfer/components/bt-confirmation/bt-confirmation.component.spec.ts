import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtConfirmationComponent } from './bt-confirmation.component';

xdescribe('BulkTransferConfirmationComponent', () => {
  let component: BtConfirmationComponent;
  let fixture: ComponentFixture<BtConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
