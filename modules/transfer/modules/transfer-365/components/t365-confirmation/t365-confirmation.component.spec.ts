import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T365ConfirmationComponent } from './t365-confirmation.component';

describe('T365ConfirmationComponent', () => {
  let component: T365ConfirmationComponent;
  let fixture: ComponentFixture<T365ConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ T365ConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T365ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
