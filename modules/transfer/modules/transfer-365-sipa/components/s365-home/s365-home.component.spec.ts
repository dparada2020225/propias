import { ComponentFixture, TestBed } from '@angular/core/testing';

import { S365HomeComponent } from './s365-home.component';

describe('S365HomeComponent', () => {
  let component: S365HomeComponent;
  let fixture: ComponentFixture<S365HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ S365HomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(S365HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
