import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAchUpdateComponent } from './am-ach-update.component';

describe('AmAchUpdateComponent', () => {
  let component: AmAchUpdateComponent;
  let fixture: ComponentFixture<AmAchUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAchUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmAchUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
