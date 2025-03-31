import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAchDetailAccountComponent } from './am-ach-detail-account.component';

describe('AmAchDetailAccountComponent', () => {
  let component: AmAchDetailAccountComponent;
  let fixture: ComponentFixture<AmAchDetailAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAchDetailAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmAchDetailAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
