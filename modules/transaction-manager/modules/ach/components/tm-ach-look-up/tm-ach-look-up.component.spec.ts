import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAchLookUpComponent } from './tm-ach-look-up.component';

describe('TmAchLookUpComponent', () => {
  let component: TmAchLookUpComponent;
  let fixture: ComponentFixture<TmAchLookUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmAchLookUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmAchLookUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
