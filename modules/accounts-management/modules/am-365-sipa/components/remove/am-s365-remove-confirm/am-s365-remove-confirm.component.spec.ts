import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmS365RemoveConfirmComponent } from './am-s365-remove-confirm.component';

describe('AmS365RemoveConfirmComponent', () => {
  let component: AmS365RemoveConfirmComponent;
  let fixture: ComponentFixture<AmS365RemoveConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmS365RemoveConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmS365RemoveConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
