import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StknBisvStepHorizontalComponent } from './stkn-bisv-step-horizontal.component';

fdescribe('StknBisvStepHorizontalComponent', () => {
  let component: StknBisvStepHorizontalComponent;
  let fixture: ComponentFixture<StknBisvStepHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StknBisvStepHorizontalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StknBisvStepHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
