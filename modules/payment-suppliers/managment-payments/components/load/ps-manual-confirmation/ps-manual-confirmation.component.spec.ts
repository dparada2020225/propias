import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsManualConfirmationComponent } from './ps-manual-confirmation.component';

describe('PsManualConfirmationComponent', () => {
  let component: PsManualConfirmationComponent;
  let fixture: ComponentFixture<PsManualConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsManualConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsManualConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
