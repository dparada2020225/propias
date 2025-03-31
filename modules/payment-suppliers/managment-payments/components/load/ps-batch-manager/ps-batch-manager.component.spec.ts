import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsBatchManagerComponent } from './ps-batch-manager.component';

describe('PsBatchManagerComponent', () => {
  let component: PsBatchManagerComponent;
  let fixture: ComponentFixture<PsBatchManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsBatchManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsBatchManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
