import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcAchDeleteComponent } from './ac-ach-delete.component';

describe('AcAchDeleteComponent', () => {
  let component: AcAchDeleteComponent;
  let fixture: ComponentFixture<AcAchDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcAchDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcAchDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
