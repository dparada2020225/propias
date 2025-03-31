import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmM365ConfirmationComponent } from './am-m365-confirmation.component';

describe('AmM365ConfirmationComponent', () => {
  let component: AmM365ConfirmationComponent;
  let fixture: ComponentFixture<AmM365ConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmM365ConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmM365ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
