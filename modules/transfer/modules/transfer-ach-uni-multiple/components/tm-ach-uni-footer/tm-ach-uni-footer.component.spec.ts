import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAchUniFooterComponent } from './tm-ach-uni-footer.component';

describe('TmAchUniFooterComponent', () => {
  let component: TmAchUniFooterComponent;
  let fixture: ComponentFixture<TmAchUniFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmAchUniFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmAchUniFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
