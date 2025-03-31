import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmM365DeleteConfirmationComponent } from './am-m365-delete-confirmation.component';

describe('AmM365DeleteConfirmationComponent', () => {
  let component: AmM365DeleteConfirmationComponent;
  let fixture: ComponentFixture<AmM365DeleteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmM365DeleteConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmM365DeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
