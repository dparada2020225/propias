import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmM365DeleteComponent } from './am-m365-delete.component';

describe('AmM365DeleteComponent', () => {
  let component: AmM365DeleteComponent;
  let fixture: ComponentFixture<AmM365DeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmM365DeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmM365DeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
