import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsManualManagerComponent } from './ps-manual-manager.component';

describe('PsManualManagerComponent', () => {
  let component: PsManualManagerComponent;
  let fixture: ComponentFixture<PsManualManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsManualManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsManualManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
