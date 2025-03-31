import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmS365HomeComponent } from './am-s365-home.component';

describe('AmS365HomeComponent', () => {
  let component: AmS365HomeComponent;
  let fixture: ComponentFixture<AmS365HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmS365HomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmS365HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
