import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHomeComponent } from './donation-home.component';

xdescribe('DonationHomeComponent', () => {
  let component: DonationHomeComponent;
  let fixture: ComponentFixture<DonationHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
