import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationConfirmationComponent } from './donation-confirmation.component';

xdescribe('DonationConfirmationComponent', () => {
  let component: DonationConfirmationComponent;
  let fixture: ComponentFixture<DonationConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
