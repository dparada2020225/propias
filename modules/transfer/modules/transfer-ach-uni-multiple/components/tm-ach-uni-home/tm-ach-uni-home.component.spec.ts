import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAchUniHomeComponent } from './tm-ach-uni-home.component';

describe('TmAchUniHomeComponent', () => {
  let component: TmAchUniHomeComponent;
  let fixture: ComponentFixture<TmAchUniHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmAchUniHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmAchUniHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
