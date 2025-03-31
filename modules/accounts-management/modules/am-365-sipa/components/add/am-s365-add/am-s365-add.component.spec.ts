import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmS365AddComponent } from './am-s365-add.component';

describe('AmS365AddComponent', () => {
  let component: AmS365AddComponent;
  let fixture: ComponentFixture<AmS365AddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmS365AddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmS365AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
