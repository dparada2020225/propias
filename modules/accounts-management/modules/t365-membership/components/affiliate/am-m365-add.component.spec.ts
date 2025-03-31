import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmM365AddComponent } from './am-m365-add.component';

describe('AmM365AddComponent', () => {
  let component: AmM365AddComponent;
  let fixture: ComponentFixture<AmM365AddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmM365AddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmM365AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
