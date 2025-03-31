import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmS365ConfirmComponent } from './am-s365-confirm.component';

describe('AmS365ConfirmComponent', () => {
  let component: AmS365ConfirmComponent;
  let fixture: ComponentFixture<AmS365ConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmS365ConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmS365ConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
