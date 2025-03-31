import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmM365DisaffiliateComponent } from './am-m365-disaffiliate.component';

describe('AmM365RemoveComponent', () => {
  let component: AmM365DisaffiliateComponent;
  let fixture: ComponentFixture<AmM365DisaffiliateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmM365DisaffiliateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmM365DisaffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
