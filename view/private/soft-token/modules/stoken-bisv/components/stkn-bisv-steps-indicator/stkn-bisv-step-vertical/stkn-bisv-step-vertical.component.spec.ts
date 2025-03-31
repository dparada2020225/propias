import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StknBisvStepVerticalComponent } from './stkn-bisv-step-vertical.component';

fdescribe('StknBisvStepVerticalComponent', () => {
  let component: StknBisvStepVerticalComponent;
  let fixture: ComponentFixture<StknBisvStepVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StknBisvStepVerticalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StknBisvStepVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
