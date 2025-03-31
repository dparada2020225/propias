import { ComponentFixture, TestBed } from '@angular/core/testing';

import { M365ConfirmationComponent } from './m365-confirmation.component';

describe('M365ConfirmationComponent', () => {
  let component: M365ConfirmationComponent;
  let fixture: ComponentFixture<M365ConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ M365ConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(M365ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
