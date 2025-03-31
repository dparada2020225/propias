import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmS365UpdateComponent } from './am-s365-update.component';

describe('AmS365UpdateComponent', () => {
  let component: AmS365UpdateComponent;
  let fixture: ComponentFixture<AmS365UpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmS365UpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmS365UpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
