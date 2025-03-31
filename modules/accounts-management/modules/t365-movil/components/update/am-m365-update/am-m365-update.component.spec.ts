import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmM365UpdateComponent } from './am-m365-update.component';

describe('AmM365UpdateComponent', () => {
  let component: AmM365UpdateComponent;
  let fixture: ComponentFixture<AmM365UpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmM365UpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmM365UpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
