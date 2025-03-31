import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T365TermsConditionComponent } from './t365-terms-condition.component';

describe('T365TermsConditionComponent', () => {
  let component: T365TermsConditionComponent;
  let fixture: ComponentFixture<T365TermsConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ T365TermsConditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T365TermsConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
