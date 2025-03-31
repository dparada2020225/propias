import { ComponentFixture, TestBed } from '@angular/core/testing';

import { S365TermsComponent } from './s365-terms.component';

describe('S365TermsComponent', () => {
  let component: S365TermsComponent;
  let fixture: ComponentFixture<S365TermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ S365TermsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(S365TermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
