import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmM365DetailAccountComponent } from './am-m365-detail-account.component';

describe('AmM365DetailAccountComponent', () => {
  let component: AmM365DetailAccountComponent;
  let fixture: ComponentFixture<AmM365DetailAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmM365DetailAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmM365DetailAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
