import { ComponentFixture, TestBed } from '@angular/core/testing';

import { M365HomeComponent } from './m365-home.component';

describe('M365HomeComponent', () => {
  let component: M365HomeComponent;
  let fixture: ComponentFixture<M365HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ M365HomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(M365HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
