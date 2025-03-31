import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtValidationsModalComponent } from './bt-validations-modal.component';

xdescribe('BtValidationsModalComponent', () => {
  let component: BtValidationsModalComponent;
  let fixture: ComponentFixture<BtValidationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtValidationsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtValidationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
