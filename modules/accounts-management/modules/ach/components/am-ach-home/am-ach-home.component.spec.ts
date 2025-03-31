import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAchHomeComponent } from './am-ach-home.component';

describe('AmAchHomeComponent', () => {
  let component: AmAchHomeComponent;
  let fixture: ComponentFixture<AmAchHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAchHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmAchHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
