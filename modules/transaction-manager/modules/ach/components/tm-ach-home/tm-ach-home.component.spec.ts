import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAchHomeComponent } from './tm-ach-home.component';

describe('TmAchHomeComponent', () => {
  let component: TmAchHomeComponent;
  let fixture: ComponentFixture<TmAchHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmAchHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmAchHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
