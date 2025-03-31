import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmS365UpdateConfirmComponent } from './am-s365-update-confirm.component';

describe('AmS365UpdateConfirmComponent', () => {
  let component: AmS365UpdateConfirmComponent;
  let fixture: ComponentFixture<AmS365UpdateConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmS365UpdateConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmS365UpdateConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
