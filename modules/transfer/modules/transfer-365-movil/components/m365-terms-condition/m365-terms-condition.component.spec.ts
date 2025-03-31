import { ComponentFixture, TestBed } from '@angular/core/testing';

import { M365TermsConditionComponent } from './m365-terms-condition.component';

describe('M365TermsConditionComponent', () => {
  let component: M365TermsConditionComponent;
  let fixture: ComponentFixture<M365TermsConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ M365TermsConditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(M365TermsConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
