import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmM365HomeComponent } from './am-m365-home.component';

describe('AmM365HomeComponent', () => {
  let component: AmM365HomeComponent;
  let fixture: ComponentFixture<AmM365HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmM365HomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmM365HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
