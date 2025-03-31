import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAchSignatoryComponent } from './tm-ach-signatory.component';

describe('TmAchSignatoryComponent', () => {
  let component: TmAchSignatoryComponent;
  let fixture: ComponentFixture<TmAchSignatoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmAchSignatoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmAchSignatoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
