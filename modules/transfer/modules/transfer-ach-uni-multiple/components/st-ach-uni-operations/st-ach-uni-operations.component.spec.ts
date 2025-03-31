import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StAchUniOperationsComponent } from './st-ach-uni-operations.component';

describe('StAchUniOperationsComponent', () => {
  let component: StAchUniOperationsComponent;
  let fixture: ComponentFixture<StAchUniOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StAchUniOperationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StAchUniOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
