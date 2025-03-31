import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tm365HomeComponent } from './tm365-home.component';

describe('Tm365HomeComponent', () => {
  let component: Tm365HomeComponent;
  let fixture: ComponentFixture<Tm365HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tm365HomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tm365HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
