import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAchCreateComponent } from './am-ach-create.component';

describe('AmAchCreateComponent', () => {
  let component: AmAchCreateComponent;
  let fixture: ComponentFixture<AmAchCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAchCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmAchCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
