import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tm365ConfirmationComponent } from './tm365-confirmation.component';

describe('Tm365ConfirmationComponent', () => {
  let component: Tm365ConfirmationComponent;
  let fixture: ComponentFixture<Tm365ConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tm365ConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tm365ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
