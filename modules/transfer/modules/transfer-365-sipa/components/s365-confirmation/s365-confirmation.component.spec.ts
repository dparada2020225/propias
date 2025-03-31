import { ComponentFixture, TestBed } from '@angular/core/testing';

import { S365ConfirmationComponent } from './s365-confirmation.component';

describe('S365ConfirmationComponent', () => {
  let component: S365ConfirmationComponent;
  let fixture: ComponentFixture<S365ConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ S365ConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(S365ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
