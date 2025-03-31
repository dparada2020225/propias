import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmS365RemoveComponent } from './am-s365-remove.component';

describe('AmS365RemoveComponent', () => {
  let component: AmS365RemoveComponent;
  let fixture: ComponentFixture<AmS365RemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmS365RemoveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmS365RemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
