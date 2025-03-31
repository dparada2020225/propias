import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tm365ModalHelperComponent } from './tm365-modal-helper.component';

describe('Tm365ModalHelperComponent', () => {
  let component: Tm365ModalHelperComponent;
  let fixture: ComponentFixture<Tm365ModalHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tm365ModalHelperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tm365ModalHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
