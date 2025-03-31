import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcAchDeleteConfirmationComponent } from './ac-ach-delete-confirmation.component';

describe('AcAchDeleteConfirmationComponent', () => {
  let component: AcAchDeleteConfirmationComponent;
  let fixture: ComponentFixture<AcAchDeleteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcAchDeleteConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcAchDeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
