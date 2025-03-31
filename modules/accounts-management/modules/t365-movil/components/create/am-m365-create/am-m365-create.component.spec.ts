import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmM365CreateComponent } from './am-m365-create.component';

describe('AmM365CreateComponent', () => {
  let component: AmM365CreateComponent;
  let fixture: ComponentFixture<AmM365CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmM365CreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmM365CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
