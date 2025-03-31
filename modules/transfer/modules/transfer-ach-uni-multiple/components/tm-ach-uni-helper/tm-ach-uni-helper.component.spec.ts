import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAchUniHelperComponent } from './tm-ach-uni-helper.component';

describe('TmAchUniHelperComponent', () => {
  let component: TmAchUniHelperComponent;
  let fixture: ComponentFixture<TmAchUniHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmAchUniHelperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmAchUniHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
